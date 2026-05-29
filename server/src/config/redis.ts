import { createClient } from "redis";

// Docker-compose handles the REDIS_URL mapping cleanly
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("✨ Connected to Redis Server"));

// Connect asynchronously on app launch
(async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
})();
