import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
        try {
            token = token.split(" ")[1];

            const decoded: any = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            );

            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch {
            res.status(401).json({ message: "Not authorized" });
        }
    } else {
        res.status(401).json({ message: "No token" });
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin access only" });
    }
};
