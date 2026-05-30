import { Queue } from "bullmq";
import nodemailer from "nodemailer";
import { sharedBullMqConnection } from "../config/redis";

// Configure and export the Nodemailer Mail Transporter
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: parseInt(process.env.SMTP_PORT || "2525"),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const emailQueue = new Queue("EmailNotificationQueue", {
    connection: sharedBullMqConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
