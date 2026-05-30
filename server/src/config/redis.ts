import { createClient } from "redis";
import IORedis from "ioredis";
import { logger } from "../utils/logger";

// Docker-compose handles the REDIS_URL mapping cleanly
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// =========================================================================
// Node-Redis (Used for standard app caching)
// =========================================================================
export const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => logger.error("Redis Client Error:", err));
redisClient.on("connect", () => logger.info("✨ Connected to Redis Server (Cache Client)"));

// Connect asynchronously on app launch
(async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
})();

// =========================================================================
// BULLMQ CLIENT: ioredis (Used for background workers & queues)
// =========================================================================
// BullMQ requires 'ioredis' and explicitly demands 'maxRetriesPerRequest: null'
export const sharedBullMqConnection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
});

sharedBullMqConnection.on("error", (err) => logger.error("💥 BullMQ Redis Error:", err));
sharedBullMqConnection.on("connect", () => logger.info("👷 Connected to Redis Server (BullMQ Client)"));
