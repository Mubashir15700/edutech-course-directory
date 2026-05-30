import { Response } from "express";
import User from "../models/User";
import { Message } from "../models/Message";
import { AuthRequest } from "../middleware/authMiddleware";

export const getChatHistory = async (req: AuthRequest, res: Response) => {
    // Learners fetch their own room, Admins pass it via params
    const roomId = req.user.role === "admin" ? req.params.roomId : req.user._id;

    const messages = await Message.find({ room: roomId })
        .sort({ createdAt: 1 }) // Order by oldest to newest for classic chat flows
        .lean();

    res.status(200).json(messages);
};

export const getAdminActiveChats = async (req: any, res: Response) => {
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
