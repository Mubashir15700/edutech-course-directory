import { Worker, Job } from "bullmq";
import { sharedBullMqConnection } from "../config/redis";
import { NOTIFICATION_QUEUE_NAME } from "../queues/notificationQueue";
import { emitToAll, emitToUser } from "../services/socket";
import { Notification } from "../models/Notification";
import User from "../models/User";
import { logger } from "../utils/logger";

const notificationWorker = new Worker(
    NOTIFICATION_QUEUE_NAME,
    async (job: Job) => {
        const { jobType, userId, title, message, category } = job.data;

        logger.info(`⏳ Processing background notification job: ${job.name} (Type: ${jobType})`);

        // --- 🎯 CASE 1: TARGETED SINGLE USER NOTIFICATION ---
        if (jobType === "single") {
            if (!userId) throw new Error("Missing targeted userId for single notification.");

            // Write immutable entry straight to MongoDB
            const doc = await Notification.create({ recipient: userId, title, message, category });

            // Stream instantly across WebSocket threads if the client is currently online
            emitToUser(userId, "notification_received", {
                id: doc._id,
                title: doc.title,
                message: doc.message,
                category: doc.category,
                time: "Just now",
                isUnread: true
            });

            logger.info(`✅ Single notification pushed to user: ${userId}`);
        }

        // --- 🌍 CASE 2: GLOBAL BULK NOTIFICATION FOR ALL LEARNERS ---
        if (jobType === "global") {
            const learners = await User.find({ role: "learner" }).select("_id").lean();

            if (learners.length === 0) return;

            // Prepare the bulk array payload for MongoDB
            const notificationRecords = learners.map(learner => ({
                recipient: learner._id,
                title,
                message,
                category,
                isUnread: true
            }));

            // Heavy DB writing operation handled SAFELY in the background thread
            await Notification.insertMany(notificationRecords);

            // Instantly notify everyone online via websockets
            emitToAll("notification_received", {
                title,
                message,
                category,
                time: "Just now",
                isUnread: true
            });

            logger.info(`✅ Global notifications distributed to ${learners.length} learners.`);
        }
    },
    {
        connection: sharedBullMqConnection,
        concurrency: 2 // Process up to 2 heavy notification loops concurrently 
    }
);

notificationWorker.on("failed", (job, err) => {
    logger.error(`❌ Notification Job ${job?.id} failed:`, err.message);
});

export default notificationWorker;
