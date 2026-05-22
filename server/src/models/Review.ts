import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    rating: number;
    comment: string;
    likes: Types.ObjectId[];
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: { createdAt: true, updatedAt: false } });

// Ensure a single user can only review a specific course once
ReviewSchema.index({ user: 1, course: 1 }, { unique: true });

export default model<IReview>("Review", ReviewSchema);
