import { notificationQueue } from "../queues/notificationQueue";

type NotificationCategory = "course" | "payment" | "system" | "chat";

export const triggerNotification = async (
    userId: string,
    title: string,
    message: string,
    category: NotificationCategory
) => {
    await notificationQueue.add("sendSingleNotification", {
        jobType: "single",
        userId,
        title,
        message,
        category
    });
};

export const triggerGlobalNotification = async (
    title: string,
    message: string,
    category: NotificationCategory
) => {
    await notificationQueue.add("sendGlobalNotification", {
        jobType: "global",
        title,
        message,
        category
    });
};
