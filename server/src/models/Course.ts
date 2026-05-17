import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
    name: string;
    instructor: string;
    duration: string;
    category: string;
    rating: number;
}

const courseSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        instructor: { type: String, required: true },
        duration: String,
        category: String,
        rating: Number,
    },
    { timestamps: true }
);

export default mongoose.model<ICourse>("Course", courseSchema);
