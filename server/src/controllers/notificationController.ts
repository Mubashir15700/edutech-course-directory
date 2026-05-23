import { Response } from 'express';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
    console.log(req.user);

    const notifications = await Notification.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    res.json({ success: true, data: notifications });
};

export const markNotificationsAsRead = async (req: AuthRequest, res: Response) => {
    await Notification.updateMany(
        { recipient: req.user.id, isUnread: true },
        { $set: { isUnread: false } }
    );

    res.json({ success: true, message: "Marked all records read" });
};
