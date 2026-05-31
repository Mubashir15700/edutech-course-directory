import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import courseRoutes from "./routes/courseRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import chatRoutes from "./routes/chatRoutes";

import { notFoundMiddleware } from "./middleware/notFoundMiddleware";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { limiter } from "./middleware/rateLimiter";

import { handleStripeWebhook } from "./controllers/enrollmentController";

import { logger } from "./utils/logger";

const app = express();

// Mount BullMQ Workers on app startup
import "./workers/notificationWorker";
import "./workers/emailWorker";
logger.info("👷 BullMQ Background Workers initialized and listening...");

app.set("trust proxy", 1);

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(limiter);

// MOUNT WEBHOOK FIRST BEFORE EXPRESS.JSON GLOBAL PARSERS
app.post(
    "/api/enrollments/webhook",
    express.raw({ type: "application/json" }), // Captures untouched raw buffer strings
    handleStripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

// 404
app.use(notFoundMiddleware);

// Global error
app.use(errorMiddleware);

const httpServer = createServer(app);

export default httpServer;
