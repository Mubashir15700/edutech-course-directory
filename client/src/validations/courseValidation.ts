import { z } from "zod";

// Sub-schema for individual lessons inside the curriculum array
export const lessonSchema = z.object({
    title: z.string().min(3, "Lesson title must be at least 3 characters"),
    duration: z.string().min(1, "Lesson duration is required"),
    videoUrl: z.string().url("Invalid video streaming URL format").optional().or(z.literal("")),
    isFreePreview: z.boolean().default(false),
});

// Core Course Schema
export const createCourseSchema = z.object({
    name: z.string().min(3, "Course name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    instructor: z.string().min(2, "Instructor name is required"),
    duration: z.string().min(1, "Duration statement is required"),
    category: z.string().min(2, "Category is required"),

    // Validates price to allow free courses (0) or positive numbers
    price: z.number().min(0, "Price cannot be negative"),

    // Restricts the input value to your strict schema enums
    level: z.enum(["Beginner", "Intermediate", "Advanced"], {
        message: "Level must be Beginner, Intermediate, or Advanced",
    }),

    thumbnail: z.string().url("Invalid thumbnail image URL format"),

    // Validates that tags is an array containing strings, requiring at least 1 tag
    tags: z.array(z.string()).min(1, "At least one descriptive tag is required"),

    rating: z.number().min(0).max(5).default(0),

    // Embeds the sub-schema for structural verification
    lessons: z.array(lessonSchema).min(1, "Course curriculum must contain at least one lesson"),
});

// Partial type for HTTP PATCH operations
export const updateCourseSchema = createCourseSchema.partial();

// Useful TypeScript Type Inferences for your frontend or backend application layers
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
