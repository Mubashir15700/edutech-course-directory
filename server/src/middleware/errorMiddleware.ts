import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Server Error",
    });
};
