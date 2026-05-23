import { Notification } from '../models/Notification';
import { emitToUser } from '../services/socket';

export const triggerNotification = async (userId: string, title: string, message: string, category: 'course' | 'payment' | 'system' | 'chat') => {
    // Write immutable entry straight to MongoDB
    const doc = await Notification.create({ recipient: userId, title, message, category });

    // Stream instantly across WebSocket threads if the client is currently online
    emitToUser(userId, 'notification_received', {
        id: doc._id,
        title: doc.title,
        message: doc.message,
        category: doc.category,
        time: "Just now",
        isUnread: true
    });
};
