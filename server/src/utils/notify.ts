import { Notification } from '../models/Notification';
import User from '../models/User';
import { emitToAll, emitToUser } from '../services/socket';

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

export const triggerGlobalNotification = async (
    title: string,
    message: string,
    category: 'course' | 'payment' | 'system' | 'chat'
) => {
    try {
        const learners = await User.find({ role: 'learner' }).select('_id').lean();

        if (learners.length === 0) return;

        // Prepare the bulk array payload for MongoDB
        const notificationRecords = learners.map(learner => ({
            recipient: learner._id,
            title,
            message,
            category,
            isUnread: true
        }));

        await Notification.insertMany(notificationRecords);

        emitToAll('notification_received', {
            title,
            message,
            category,
            time: "Just now",
            isUnread: true
        });
    } catch (error) {
        console.error("Failed to distribute global notification:", error);
    }
};
