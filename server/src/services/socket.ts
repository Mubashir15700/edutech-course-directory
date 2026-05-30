import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Message } from '../models/Message';
import { logger } from '../utils/logger';

let io: Server;
// Keep a fast-lookup map of active userId -> array of socketIds (handles multiple tabs)
const activeConnections = new Map<string, string[]>();

export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;

        logger.info(`User ${userId} connected with socket ID ${socket.id}.`);

        if (userId) {
            const currentSockets = activeConnections.get(userId) || [];
            activeConnections.set(userId, [...currentSockets, socket.id]);

            logger.info(`User ${userId} connected with socket ID ${socket.id}. Total connections for user: ${activeConnections.get(userId)?.length}`);
        }

        socket.on('disconnect', () => {
            if (userId) {
                const currentSockets = activeConnections.get(userId) || [];
                const updatedSockets = currentSockets.filter(id => id !== socket.id);

                if (updatedSockets.length > 0) {
                    activeConnections.set(userId, updatedSockets);
                } else {
                    activeConnections.delete(userId);
                }
            }
        });

        socket.on("join_chat_room", ({ roomId }) => {
            socket.join(roomId);
            logger.info(`Socket ${socket.id} joined chat room: ${roomId}`);
        });

        socket.on("send_message", async ({ roomId, senderId, text }) => {
            try {
                const newMessage = await Message.create({
                    room: roomId,
                    sender: senderId,
                    text
                });

                io.to(roomId).emit("message_received", {
                    id: newMessage._id,
                    room: newMessage.room,
                    sender: newMessage.sender,
                    text: newMessage.text,
                    createdAt: newMessage.createdAt
                });
            } catch (error) {
                logger.error("Failed to route socket message:", error);
            }
        });

        socket.on("leave_chat_room", ({ roomId }) => {
            socket.leave(roomId);
        });
    });

    return io;
};

export const emitToUser = (userId: string, event: string, payload: any) => {
    if (!io) return;
    const userSockets = activeConnections.get(userId);
    if (userSockets && userSockets.length > 0) {
        userSockets.forEach(socketId => {
            io.to(socketId).emit(event, payload);
        });
    }
};

export const emitToAll = (event: string, payload: any) => {
    if (!io) return;
    io.emit(event, payload); // standard socket.io broadcast to all connections
};
