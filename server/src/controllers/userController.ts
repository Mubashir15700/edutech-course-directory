import { Request, Response } from "express";
import User from "../models/User";

export const getLearners = async (req: Request, res: Response) => {
    try {
        const { page = "1", limit = "6", search = "" } = req.query;

        const query: any = {
            name: { $regex: search, $options: "i" },
            role: req.query.role || "learner",
        };

        const learners = await User.find(query)
            .select("-password")
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await User.countDocuments(query);

        res.json({
            data: learners,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
