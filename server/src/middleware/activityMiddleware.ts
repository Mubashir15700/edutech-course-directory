import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { logger } from "../utils/logger";

export const trackUserActivity = async (req: Request, res: Response, next: NextFunction) => {
    // Check if auth middleware has attached the authenticated user to the request object
    const authenticatedUser = (req as any).user;

    if (authenticatedUser && authenticatedUser._id) {
        try {
            // Using findByIdAndUpdate with un-awaited execution prevents blocking the API response
            // We only update if the last check was more than 15 minutes ago to avoid smashing the DB with writes
            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

            if (!authenticatedUser.lastActiveAt || authenticatedUser.lastActiveAt < fifteenMinutesAgo) {
                await User.findByIdAndUpdate(authenticatedUser._id, {
                    lastActiveAt: new Date()
                });
            }
        } catch (error) {
            logger.error(`Failed to update user activity timestamp: ${error}`);
            // We don't call next(error) here because we don't want an activity log failure to crash the user's experience
        }
    }

    next();
};
