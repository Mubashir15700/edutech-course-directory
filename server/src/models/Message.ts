import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    room: mongoose.Types.ObjectId; // Equal to the learner's User ID
    sender: mongoose.Types.ObjectId; // The actual sender (Learner or Admin)
    senderModel: "User";
    text: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        room: { type: Schema.Types.ObjectId, ref: "User", required: true },
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

// Indexing for faster history lookups sorted by date
MessageSchema.index({ room: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
