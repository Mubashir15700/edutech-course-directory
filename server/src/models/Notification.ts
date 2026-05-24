import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
    recipient: Schema.Types.ObjectId | string;
    title: string;
    message: string;
    category: 'course' | 'payment' | 'system' | 'chat';
    isUnread: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    category: { type: String, enum: ['course', 'payment', 'system', 'chat'], default: 'system' },
    isUnread: { type: Boolean, default: true },
}, {
    timestamps: true
});

// Index on createdAt for efficient sorting and automatic expiration after 7 days (604800 seconds)
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export const Notification = model<INotification>('Notification', NotificationSchema);
