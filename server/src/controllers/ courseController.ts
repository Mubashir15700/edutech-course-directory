import { Request, Response } from "express";
import Course from "../models/Course";

export const getCourses = async (req: Request, res: Response) => {
    try {
        const { page = "1", limit = "6", search = "", category = "" } = req.query;

        const query: any = {
            name: { $regex: search, $options: "i" },
        };

        if (category) {
            query.category = category;
        }

        const courses = await Course.find(query)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Course.countDocuments(query);

        res.json({
            data: courses,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const course = new Course(req.body);
        const saved = await course.save();
        res.status(201).json(saved);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const updated = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Course deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
