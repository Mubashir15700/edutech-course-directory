import { Request, Response } from "express";
import Course from "../models/Course";

export const getCourses = async (req: Request, res: Response) => {
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
};

export const createCourse = async (req: Request, res: Response) => {
    const course = new Course(req.body);
    const saved = await course.save();
    res.status(201).json(saved);
};

export const updateCourse = async (req: Request, res: Response) => {
    const updated = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!updated) {
        res.status(404);
        throw new Error("Course not found");
    }

    res.json(updated);
};

export const deleteCourse = async (req: Request, res: Response) => {
    const deleted = await Course.findByIdAndDelete(req.params.id);

    if (!deleted) {
        res.status(404);
        throw new Error("Course not found");
    }

    res.json({
        success: true,
        message: "Course deleted",
    });
};

