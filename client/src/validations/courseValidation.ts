import { z } from "zod";

export const createCourseSchema = z.object({
    name: z.string().min(3, "Course name is required"),

    instructor: z.string().min(2, "Instructor name is required"),

    duration: z.string().min(1, "Duration is required"),

    category: z.string().min(2, "Category is required"),

    rating: z.number().min(0).max(5),
});

export const updateCourseSchema = createCourseSchema.partial();
