import React, { useState, useEffect } from "react";

export interface ReviewFormProps {
    initialRating?: number;
    initialComment?: string;
    onSubmit: (data: { rating: number; comment: string }) => void | Promise<void>;
    isSubmitting: boolean;
    onCancel?: () => void;
    submitLabel?: string;
    loadingLabel?: string;
}

export default function ReviewForm({
    initialRating = 5,
    initialComment = "",
    onSubmit,
    isSubmitting,
    onCancel,
    submitLabel,
    loadingLabel,
}: ReviewFormProps) {
    const [rating, setRating] = useState<number>(initialRating);
    const [comment, setComment] = useState<string>(initialComment);

    // Sync state if initial values shift under the hood (useful when opening edit states)
    useEffect(() => {
        setRating(initialRating);
        setComment(initialComment);
    }, [initialRating, initialComment]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!comment.trim()) return;
        onSubmit({ rating, comment });
    };

    // Determine intuitive button labels depending on whether onCancel is supplied
    const isEditMode = !!onCancel;
    const finalSubmitLabel = submitLabel || (isEditMode ? "Save Changes" : "Submit Review");
    const finalLoadingLabel = loadingLabel || (isEditMode ? "Saving..." : "Posting...");

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Picker */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setRating(star)}
                            className={`text-xl transition-colors ${star <= rating ? "text-amber-400" : "text-gray-300"
                                } disabled:opacity-50`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment Textarea Input */}
            <div className="relative">
                <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this course..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:bg-gray-50 bg-white"
                    disabled={isSubmitting}
                />
            </div>

            {/* Action Buttons Container */}
            <div className="flex justify-end gap-2">
                {/* Render Cancel button conditionally only if an onCancel handler exists */}
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? finalLoadingLabel : finalSubmitLabel}
                </button>
            </div>
        </form>
    );
}
