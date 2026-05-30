import { Job, Worker } from "bullmq";
import { sharedBullMqConnection } from "../config/redis";
import { transporter } from "../queues/emailQueue";
import User from "../models/User";
import { logger } from "../utils/logger";

// Define the Background Worker Logic
const emailWorker = new Worker("EmailNotificationQueue", async (job: Job) => {
    const { courseName, courseId } = job.data;

    logger.info(`✉️ Worker processing email blast for course: ${courseName}`);

    // Fetch all student email records from the database
    // Using .cursor() processes records in streaming batches, protecting server memory
    const userCursor = User.find({ role: "learner" }).select("email name").cursor();

    for (let user = await userCursor.next(); user != null; user = await userCursor.next()) {
        try {
            await transporter.sendMail({
                from: '"EduTech Course Directory" <noreply@yourplatform.com>',
                to: user.email,
                subject: "New Course Available! 🎓",
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Hello ${user.name},</h2>
                        <p>We are excited to announce that a brand new course has just been published!</p>
                        <blockquote style="background: #f3f4f6; padding: 15px; border-left: 4px solid #4f46e5; font-weight: bold; margin: 20px 0;">
                            "${courseName}"
                        </blockquote>
                        <p>Click below to dive in and start leveling up your skills today:</p>
                        <a href="${process.env.CLIENT_URL}/courses/${courseId}" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 10px;">
                            View Course Details
                        </a>
                    </div>
                `,
            });
        } catch (mailError) {
            logger.error(`Failed sending newsletter target mail to ${user.email}:`, mailError);
            // We catch individual email failures inside the loop so one bad email address
            // doesn't crash the entire background job for the rest of your students.
        }
    }
}, {
    connection: sharedBullMqConnection
});

emailWorker.on("error", (err) => {
    logger.error("❌ BullMQ Email Worker Global Error:", err);
});

emailWorker.on("failed", (job, err) => {
    logger.error(`⚠️ Job ${job?.id} failed with error: ${err.message}`);
});

export default emailWorker;
