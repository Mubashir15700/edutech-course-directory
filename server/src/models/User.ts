import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "learner";
    isActive: boolean;
    enrolledCourses: {
        courseId: mongoose.Types.ObjectId;
        completedLessons: mongoose.Types.ObjectId[];
    }[];
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false // Excludes password from query results by default for security
        },
        role: {
            type: String,
            enum: ["admin", "learner"],
            default: "learner",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        enrolledCourses: [
            {
                courseId: { type: Schema.Types.ObjectId, ref: "Course" },
                // Array of lesson ObjectIds this specific user has marked complete
                completedLessons: [{ type: Schema.Types.ObjectId }]
            }
        ],
        // System updates this during token login or auth refresh tracking middleware
        lastActiveAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>("User", userSchema);
