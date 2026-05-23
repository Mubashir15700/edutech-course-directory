import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
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

        console.log(`User ${userId} connected with socket ID ${socket.id}.`);

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
