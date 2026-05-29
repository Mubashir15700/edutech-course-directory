import { redisClient } from "../config/redis";
import { logger } from "./logger";

// Safely find matching Redis keys using SCAN (better than KEYS)
const scanKeys = async (pattern: string) => {
    let cursor = '0';
    const keys: string[] = [];

    do {
        // Scan Redis in small batches
        const reply = await redisClient.scan(cursor, {
            MATCH: pattern,
            COUNT: 100,
        });

        // Move cursor forward
        cursor = reply.cursor;

        // Collect matched keys
        keys.push(...reply.keys);

    } while (cursor !== '0'); // Stop when scan completes

    return keys;
};

export const clearCourseCache = async (courseId?: string) => {
    try {

        // Remove all cached course list pages
        const catalogKeys = await scanKeys("courses:*");

        if (catalogKeys.length) {
            await redisClient.del(catalogKeys);
        }

        // Remove cached detail pages for a specific course
        if (courseId) {
            const detailKeys = await scanKeys(`course:${courseId}:*`);

            if (detailKeys.length) {
                await redisClient.del(detailKeys);
            }
        }

        logger.info("♻️ Redis cache invalidated");

    } catch (err) {

        // Prevent Redis failures from crashing the app
        logger.error("Redis invalidation error:", err);
    }
};
