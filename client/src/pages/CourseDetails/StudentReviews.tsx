import ReviewForm from "../../components/ReviewForm";
import type { Review } from "../../features/courses/types";
import type { StarMetrics } from "./CourseDetails.types";

interface StudentReviewsProps {
    courseRating: number;
    numReviews: number;
    starBreakdown: StarMetrics[];
    userReview: Review | undefined;
    otherReviews: Review[];
    isAlreadyEnrolled: boolean | undefined;
    isEditingMyReview: boolean | undefined;
    isSubmitting: boolean;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    handleReviewSubmit: (data: { rating: number; comment: string }) => void | Promise<void>;
    handleStartEdit: () => void;
    handleCancelEdit: () => void;
    handleDelete: (reviewId: string) => void;
    handleLikeToggle: (reviewId: string) => void;
}

const StudentReviews = ({ courseRating, numReviews, starBreakdown, userReview, otherReviews, isAlreadyEnrolled, isEditingMyReview, isSubmitting, activeMenuId, setActiveMenuId, handleReviewSubmit, handleStartEdit, handleCancelEdit, handleDelete, handleLikeToggle }: StudentReviewsProps) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Student Feedback</h2>
                <p className="text-sm text-gray-500 mt-0.5">What learners are saying about this training course</p>
            </div>

            {/* Score Aggregator Layout Summary */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <div className="text-center sm:border-r sm:border-gray-200 sm:pr-8">
                    <p className="text-5xl font-black text-gray-900 leading-none">{courseRating}</p>
                    <div className="flex justify-center gap-0.5 my-2 text-amber-400 text-lg">⭐⭐⭐⭐⭐</div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{numReviews} Course Reviews</p>
                </div>
                <div className="flex-1 w-full space-y-2">
                    {starBreakdown.map((row) => (
                        <div key={row.stars} className="flex items-center text-xs text-gray-600 gap-3">
                            <span className="w-12 text-right font-medium">{row.stars} stars</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }}></div>
                            </div>
                            <span className="w-8 text-gray-400 text-right font-medium">{row.pct}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews Individual Feed Stream */}
            <div className="divide-y divide-gray-100 space-y-6 pt-2">

                {/* PINNED LOGGED-IN USER REVIEW */}
                {userReview && (
                    <div className="pt-6 first:pt-3 bg-amber-50/20 p-4 rounded-2xl border border-amber-100/60 relative">
                        <span className="absolute top-10 right-5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                            Your Review
                        </span>

                        {isEditingMyReview ? (
                            /* REUSED FORM STRUCTURE IN EDIT MODE */
                            <div className="space-y-4">
                                <h3 className="text-base font-bold text-gray-900">Edit Your Review</h3>
                                <ReviewForm
                                    initialRating={userReview.rating}
                                    initialComment={userReview.comment}
                                    onSubmit={handleReviewSubmit}
                                    isSubmitting={isSubmitting}
                                    onCancel={handleCancelEdit}
                                />
                            </div>
                        ) : (
                            /* CARD READ MODE WITH TOGGLE DROPDOWN OPTIONS */
                            <div className="flex gap-4 items-start w-full">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-inner uppercase">
                                    {userReview.user?.name?.substring(0, 2) || "ME"}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">{userReview.user?.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(userReview.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </span>

                                            {/* Menu Action Dropdown Anchor */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveMenuId(activeMenuId === userReview._id ? null : userReview._id)}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    ⋮
                                                </button>
                                                {activeMenuId === userReview._id && (
                                                    <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 text-xs">
                                                        <button
                                                            onClick={handleStartEdit}
                                                            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(userReview._id)}
                                                            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium border-t border-gray-100"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex text-amber-400 text-xs mb-2">
                                        {Array.from({ length: userReview.rating }).map((_, i) => <span key={i}>⭐</span>)}
                                    </div>

                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white/80 p-3 rounded-xl border border-amber-100/30">
                                        {userReview.comment}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* OTHER LEARNERS' REVIEW FEEDS */}
                {otherReviews.map((review: Review) => (
                    <div key={review._id} className="pt-6 flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-inner uppercase">
                            {review.user?.name?.substring(0, 2) || "ST"}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{review.user?.name}</h3>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                            </div>

                            <div className="flex text-amber-400 text-xs mb-2">
                                {Array.from({ length: review.rating }).map((_, i) => <span key={i}>⭐</span>)}
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/30 p-3 rounded-xl border border-gray-100">
                                {review.comment}
                            </p>

                            <div className="mt-3 flex items-center gap-4">
                                <button
                                    onClick={() => handleLikeToggle(review._id)}
                                    className={`text-xs font-semibold py-1 px-3 rounded-full border transition flex items-center gap-1.5 ${review.hasLiked
                                        ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                                        }`}
                                >
                                    👍 {review.hasLiked ? "Helpful!" : "Was this helpful?"}
                                    {review.likes > 0 && (
                                        <span className={`ml-1 font-bold ${review.hasLiked ? "text-blue-700" : "text-gray-400"}`}>
                                            ({review.likes})
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* BASE CREATE REVIEW CONTAINER FORM */}
                {(isAlreadyEnrolled && !userReview) && (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>

                        <ReviewForm
                            onSubmit={handleReviewSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                )}

            </div>
        </div>
    )
}

export default StudentReviews