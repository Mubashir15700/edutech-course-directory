import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import Course from "../models/Course";
import { logger } from "../utils/logger";

// Initialize the client (it automatically picks up process.env.GEMINI_API_KEY under the hood,
// but passing it explicitly keeps your environment layout robust)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateLessonQuiz = async (req: Request, res: Response) => {
    const { courseId, lessonId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Target course not found." });
        }

        const lesson = course.lessons.find((l: any) => l._id.toString() === lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Target lesson structural index not found." });
        }

        // Craft a precise prompt detailing the data footprint contract
        const dynamicPrompt = `
            Analyze this lesson metadata context:
            Course Theme: "${course.name}"
            Course Description: "${course.description}"
            Target Lesson Title: "${lesson.title}"

            Generate exactly 3 educational multiple-choice questions testing concepts a student should understand from this lesson topic.
            
            You MUST return a raw valid JSON array matching this typescript structural layout contract:
            Array<{
                question: string;
                options: string[]; // Must contain exactly 4 unique options
                correctAnswerIndex: number; // The 0-based array slot tracking the true answer (0 to 3)
                explanation: string; // Brief detail clarifying why the answer choice is accurate
            }>
        `;

        // Invoke the generation engine with a unified parameter block, ensuring all configuration is centralized and clear
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Specify target model tier
            contents: dynamicPrompt,
            config: {
                // System instructions
                systemInstruction: "You are an elite software engineering professor. Your job is to output academic multiple-choice quizzes in strict JSON format. Never include introductory text, conversational remarks, or markdown wrapping code-blocks.",

                // Enforces a strict JSON parsing layout contract matching your exact model requirements
                responseMimeType: "application/json",
                temperature: 0.2
            }
        });

        const rawTextResponse = response.text;

        if (!rawTextResponse) {
            throw new Error("Empty text block returned from the generation engine pipeline.");
        }

        const structuredQuizPayload = JSON.parse(rawTextResponse);

        res.status(200).json({
            courseId,
            lessonId,
            lessonTitle: lesson.title,
            quiz: structuredQuizPayload
        });
    } catch (error) {
        logger.error("Gemini Quiz Generation Pipeline Failure:", error);
        res.status(500).json({ message: "AI generation engine ran into an error processing the curriculum quiz request." });
    }
};
