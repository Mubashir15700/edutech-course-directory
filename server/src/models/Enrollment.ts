import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    status: "pending" | "completed" | "failed";
    paymentId?: string;
    amountPaid: number;
}

const EnrollmentSchema = new Schema<IEnrollment>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
        paymentId: { type: String }, // Stripe Session ID or Charge ID
        amountPaid: { type: Number, required: true },
    },
    { timestamps: true }
);

// Prevent a user from creating duplicate enrollment records for the same course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
