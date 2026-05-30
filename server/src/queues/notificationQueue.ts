import { Queue } from "bullmq";
import { sharedBullMqConnection } from "../config/redis";

export const NOTIFICATION_QUEUE_NAME = "global-notifications";

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
    connection: sharedBullMqConnection,
    defaultJobOptions: {
        attempts: 3, // Automatically retry a failed job 3 times
        backoff: {
            type: "exponential",
            delay: 5000, // Wait 5s, then 10s, then 20s between retries
        },
        removeOnComplete: true, // Auto-clean Redis memory when a job finishes successfully
        removeOnFail: false,    // Keep failed jobs in the dashboard logs for debugging
    },
});
