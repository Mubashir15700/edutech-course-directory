import { Request, Response } from "express";
import User from "../models/User";
import { Message } from "../models/Message";
import { AuthRequest } from "../middleware/authMiddleware";

export const getChatHistory = async (req: AuthRequest, res: Response) => {
    const roomId = req.user.role === "admin" ? req.params.roomId : req.user._id;

    // Get the timestamp cursor from query params (e.g., ?before=2026-05-30T12:00:00.000Z)
    const { before } = req.query;
    const limit = parseInt(req.query.limit as string) || 20;

    // Build the query object
    const query: any = { room: roomId };

    // If a cursor is provided, only fetch messages older than that cursor
    if (before) {
        query.createdAt = { $lt: new Date(before as string) };
    }

    const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    // Reverse them to chronological order (oldest to newest) for the frontend array
    res.status(200).json(messages.reverse());
};

export const getAdminActiveChats = async (req: Request, res: Response) => {
    // Group messages by unique room (learner ID) and grab the newest entry date
    const activeRooms = await Message.aggregate([
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$room",
                lastMessage: { $first: "$text" },
                lastMessageAt: { $first: "$createdAt" },
            }
        },
        { $sort: { lastMessageAt: -1 } }
    ]);

    // Populate basic learner profile information for each active room thread
    const populatedChats = await Promise.all(
        activeRooms.map(async (room) => {
            const student = await User.findById(room._id).select("name email").lean();
            return {
                roomId: room._id,
                studentName: student?.name || "Unknown Student",
                studentEmail: student?.email || "N/A",
                lastMessage: room.lastMessage,
                lastMessageAt: room.lastMessageAt
            };
        })
    );

    res.status(200).json(populatedChats);
};
