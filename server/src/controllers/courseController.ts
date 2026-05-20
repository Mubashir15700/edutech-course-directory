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

    // Define exactly what fields the Course Card grid component needs
    const selectedFields = "name instructor duration category price level thumbnail rating";

    const courses = await Course.find(query)
        .select(selectedFields)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
        data: courses,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    });
};

export const getCourseById = async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    res.json({
        data: course,
    });
};

export const createCourse = async (req: Request, res: Response) => {
    const course = new Course(req.body);
    const saved = await course.save();
    res.status(201).json(saved);
};

export const updateCourse = async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Using .set() forces Mongoose to merge arrays cleanly while retaining 
    // sub-document IDs for items that match, or creating them for items that are new.
    course.set(req.body);

    // 3. Save the document — this triggers pre-save hooks and nested validations!
    const updated = await course.save();

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
