import mongoose, { Document, Schema } from "mongoose";

export interface ILesson {
    title: string;
    duration: string; // e.g., "10:15" or "15 mins"
    videoUrl?: string;
    isFreePreview: boolean;
}

export interface ICourse extends Document {
    name: string;
    description: string;
    instructor: string;
    duration: string; // Overall duration, e.g., "12 hours total"
    category: string;
    price: number;
    level: "Beginner" | "Intermediate" | "Advanced";
    thumbnail?: string;
    tags: string[];
    rating: number; // Average rating from reviews
    numReviews: number; // Total number of reviews for accurate average rating calculation
    lessons: ILesson[];
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Sub-schema for individual lessons
const lessonSchema = new Schema({
    title: {
        type: String,
        required: [true, "Lesson title is required"],
        trim: true
    },
    duration: {
        type: String,
        required: [true, "Lesson duration is required"]
    },
    videoUrl: {
        type: String,
        default: ""
    },
    isFreePreview: {
        type: Boolean,
        default: false // Allows admins to mark standard sample lessons
    }
});

// Main course schema
const courseSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Course name is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Course description is required"]
        },
        instructor: {
            type: String,
            required: [true, "Instructor name is required"],
            trim: true
        },
        duration: {
            type: String,
            required: [true, "Overall course duration is required"]
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: [0, "Price cannot be negative"]
        },
        level: {
            type: String,
            required: [true, "Difficulty level is required"],
            enum: {
                values: ["Beginner", "Intermediate", "Advanced"],
                message: "{VALUE} is not a valid course level"
            }
        },
        thumbnail: {
            type: String,
            default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600"
        },
        tags: {
            type: [String],
            default: []
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        numReviews: {
            type: Number,
            default: 0,
            min: 0
        },
        // Injected sub-schema array for course content
        lessons: [lessonSchema],
        isArchived: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICourse>("Course", courseSchema);
