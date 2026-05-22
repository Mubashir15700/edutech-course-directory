import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Review from "../models/Review";
import Course from "../models/Course";


const seedReviews = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI || "");
        console.log("Database linked successfully.");

        // Clear out any existing reviews to prevent duplicates
        await Review.deleteMany({});
        console.log("Cleared old reviews entries from collection.");

        // Define your actual Mongo User Document IDs
        const nikoId = new mongoose.Types.ObjectId("6a0c7d61a534c4a205ce97d1");
        const romanId = new mongoose.Types.ObjectId("6a0c7d70a534c4a205ce97d2");

        // Verify your course containers exist in the target database
        const masterclass = await Course.findById("6a0d2bf4cf91429e7a1d2056");
        const uiuxSystem = await Course.findById("6a0d2bf4cf91429e7a1d205a");
        const pythonIntro = await Course.findById("6a0d2bf4cf91429e7a1d205d");

        const batchReviews = [];

        // Add Review for Full-Stack React & Node.js Masterclass if it exists
        if (masterclass) {
            batchReviews.push({
                user: nikoId,
                course: masterclass._id,
                rating: 5,
                comment: "Exceptional breakdown of core concepts! The section on asynchronous state architecture completely changed how I handle layout flows in production applications.",
                likes: [romanId], // Roman liked Niko's review
                createdAt: new Date("2026-05-21T10:00:00.000Z")
            });
        }

        // Add Review for Advanced UI/UX Systems if it exists
        if (uiuxSystem) {
            batchReviews.push({
                user: romanId,
                course: uiuxSystem._id,
                rating: 4,
                comment: "The micro-interaction details here are beautiful. Best design system walkthrough I have seen. Fits perfectly into modern frontend workflows.",
                likes: [nikoId], // Niko liked Roman's review
                createdAt: new Date("2026-05-20T14:30:00.000Z")
            });
        }

        // Add a secondary review under Python Intro for Niko
        if (pythonIntro) {
            batchReviews.push({
                user: nikoId,
                course: pythonIntro._id,
                rating: 5,
                comment: "Perfect starting point for data handling structures. The examples are straightforward and easy to grasp.",
                likes: [],
                createdAt: new Date("2026-05-22T01:15:00.000Z")
            });
        }

        // Execute bulk injection payload
        if (batchReviews.length > 0) {
            await Review.insertMany(batchReviews);
            console.log(`Successfully injected ${batchReviews.length} structured reviews!`);
        } else {
            console.log("No matching courses found. Check your course ObjectIDs.");
        }

        // Automatically recalculate and sync Course cached averages
        console.log("Recalculating course average metrics...");
        const coursesToUpdate = [masterclass, uiuxSystem, pythonIntro].filter(Boolean);

        for (const course of coursesToUpdate) {
            if (!course) continue;
            const stats = await Review.aggregate([
                { $match: { course: course._id } },
                {
                    $group: {
                        _id: "$course",
                        numReviews: { $sum: 1 },
                        avgRating: { $avg: "$rating" }
                    }
                }
            ]);

            if (stats.length > 0) {
                await Course.findByIdAndUpdate(course._id, {
                    rating: Math.round(stats[0].avgRating * 10) / 10,
                    numReviews: stats[0].numReviews
                });
            }
        }
        console.log("Course averages synchronized.");

        process.exit(0);
    } catch (error) {
        console.error("Seeding runtime failure:", error);
        process.exit(1);
    }
};

seedReviews();