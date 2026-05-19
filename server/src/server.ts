import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import connectDB from "./config/db";
import { logger } from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 5000;

let server: any;

const startServer = async () => {
    try {
        // Connect DB
        await connectDB();

        // Start server
        server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server");
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    try {
        // Stop accepting new requests
        server.close(async () => {
            logger.info("HTTP server closed");

            // Close MongoDB connection
            await mongoose.connection.close();

            logger.info("MongoDB connection closed");

            process.exit(0);
        });
    } catch (error) {
        logger.error("Error during graceful shutdown");
        process.exit(1);
    }
};

// Handle termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
    logger.error(`Unhandled Rejection: ${err.message}`);

    gracefulShutdown("UNHANDLED_REJECTION");
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: any) => {
    logger.error(`Uncaught Exception: ${err.message}`);

    gracefulShutdown("UNCAUGHT_EXCEPTION");
});
