import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    useGetCourseByIdQuery,
    useToggleLikeReviewMutation,
    useAddReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation
} from "../features/courses/coursesApi";
import type { Review } from "../features/courses/types";
import CourseLoading from "../components/CourseLoading";
import CourseNotFound from "../components/CourseNotFound";
import EnrollButton from "../components/EnrollButton";
import { useGetProfileQuery } from "../features/users/usersApi";

export default function CourseDetails() {
    const { id } = useParams<{ id: string }>();

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [isEditingMyReview, setIsEditingMyReview] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // Fetch profile state to determine if user is already enrolled
    const { data: user } = useGetProfileQuery();
    const { data: course, isLoading, error } = useGetCourseByIdQuery({ id: id || "", userId: user?._id, fetchReviews: true });
    const [toggleLikeReview] = useToggleLikeReviewMutation();
    const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();
    const [updateReview] = useUpdateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    const isAlreadyEnrolled = user?.enrolledCourses?.some((enrollment: any) => {
        const enrolledId = enrollment.courseId?._id || enrollment._id || enrollment;
        return enrolledId === id;
    });

    const allReviews = course?.data?.reviews || [];
    const userReview = allReviews.find((rev: any) => rev.user?._id === user?._id);
    const otherReviews = allReviews.filter((rev: any) => rev.user?._id !== user?._id);

    const starBreakdown = useMemo(() => {
        const total = otherReviews.length + (userReview ? 1 : 0);

        // Initialize our counts for each star tier
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        // Count how many reviews land in each star category
        otherReviews.forEach((rev: any) => {
            const rating = Math.round(rev.rating) as 1 | 2 | 3 | 4 | 5;
            if (counts[rating] !== undefined) {
                counts[rating]++;
            }
        });

        // Handle the user's review if it exists
        if (userReview) {
            const rating = Math.round(userReview.rating) as 1 | 2 | 3 | 4 | 5;
            if (counts[rating] !== undefined) {
                counts[rating]++;
            }
        }

        // Convert counts to percentages for the Tailwind progress bars
        return [5, 4, 3, 2, 1].map((stars) => {
            const count = counts[stars as 1 | 2 | 3 | 4 | 5];
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return {
                stars,
                pct: `${percentage}%`,
            };
        });
    }, [otherReviews, userReview]);

    // UI State to toggle curriculum view visibility
    const [isCurriculumOpen, setIsCurriculumOpen] = useState(true);

    if (isLoading) return <CourseLoading />;
    if (error || !course) return <CourseNotFound />;

    const handleLikeToggle = (reviewId: string) => {
        toggleLikeReview(reviewId).unwrap();
    };

    const handleStartEdit = () => {
        if (userReview) {
            setRating(userReview.rating);
            setComment(userReview.comment);
            setIsEditingMyReview(true);
            setActiveMenuId(null); // Clear the settings dropdown pane
        }
    };

    const handleCancelEdit = () => {
        setIsEditingMyReview(false);
        setComment("");
        setRating(5);
    };

    // Modify your existing submit handler to handle BOTH creation and updates
    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            if (userReview) {
                // Update mode
                await updateReview({
                    reviewId: userReview._id,
                    courseId: id || "",
                    rating,
                    comment: comment.trim()
                }).unwrap();
                setIsEditingMyReview(false);
            } else {
                // Creation mode
                await addReview({
                    courseId: id || "",
                    rating,
                    comment: comment.trim()
                }).unwrap();
            }
            setComment("");
            setRating(5);
        } catch (err) {
            console.error("Failed to process review action:", err);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (window.confirm("Are you sure you want to delete your review?")) {
            try {
                await deleteReview({ reviewId, courseId: id || "" }).unwrap();
                setIsEditingMyReview(false);
                setComment("");
                setRating(5);
            } catch (err) {
                console.error("Failed to delete review", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-16">
            {/* Top Navigation Banner */}
            <div className="max-w-6xl mx-auto px-4 mb-6 sm:px-6 lg:px-8">
                <Link to="/courses" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2">
                    ← Back to Course Directory
                </Link>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN: Main course content detailed breakdowns */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold tracking-wide uppercase">
                                {course.data.category}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4 leading-tight">
                                {course.data.name}
                            </h1>

                            {/* Meta Info row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-4">
                                <p>Instructed by <span className="font-semibold text-gray-900">{course.data.instructor}</span></p>
                                <span className="text-gray-300">•</span>
                                <p className="flex items-center gap-1">⭐ <span className="font-semibold text-gray-900">{course.data.rating} ({course.data.numReviews})</span></p>
                                <span className="text-gray-300">•</span>
                                <p className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">{course.data.level}</p>
                            </div>

                            <h2 className="text-lg font-bold text-gray-900 mb-2">About This Course</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {course.data.description}
                            </p>

                            {/* Tags list component */}
                            <div className="flex flex-wrap gap-2 mt-6">
                                {course.data.tags.map((tag) => (
                                    <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ACCORDION MODULE: Syllabus/Lessons */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
                                className="w-full flex items-center justify-between p-6 bg-white border-b border-gray-100 font-bold text-lg text-gray-900 hover:bg-gray-50/50 transition text-left"
                            >
                                <span>Course Curriculum ({course.data.lessons.length} lessons)</span>
                                <span className="text-gray-400 text-xl">{isCurriculumOpen ? "▲" : "▼"}</span>
                            </button>

                            {isCurriculumOpen && (
                                <div className="divide-y divide-gray-100">
                                    {course.data.lessons.map((lesson, idx) => (
                                        <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/30 transition">
                                            <div className="flex items-start gap-3">
                                                <span className="text-sm font-semibold text-gray-400 mt-0.5 w-5">
                                                    {String(idx + 1).padStart(2, "0")}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                                                    {lesson.isFreePreview && (
                                                        <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mt-1">
                                                            Free Preview Lecture
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                ⏱️ {lesson.duration}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ========================================================= */}
                        {/* NEW COMPONENT SECTION: Student Reviews & Community Likes   */}
                        {/* ========================================================= */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
                            <div className="border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-bold text-gray-900">Student Feedback</h2>
                                <p className="text-sm text-gray-500 mt-0.5">What learners are saying about this training course</p>
                            </div>

                            {/* Score Aggregator Layout Summary */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                                <div className="text-center sm:border-r sm:border-gray-200 sm:pr-8">
                                    <p className="text-5xl font-black text-gray-900 leading-none">{course.data.rating}</p>
                                    <div className="flex justify-center gap-0.5 my-2 text-amber-400 text-lg">⭐⭐⭐⭐⭐</div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{course.data.numReviews} Course Reviews</p>
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

                                {/* 1. PINNED LOGGED-IN USER REVIEW */}
                                {userReview && (
                                    <div className="pt-6 first:pt-3 bg-amber-50/20 p-4 rounded-2xl border border-amber-100/60 relative">
                                        <span className="absolute top-10 right-5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                            Your Review
                                        </span>

                                        {isEditingMyReview ? (
                                            /* REUSED FORM STRUCTURE IN EDIT MODE */
                                            <div className="space-y-4">
                                                <h3 className="text-base font-bold text-gray-900">Edit Your Review</h3>
                                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                    {/* Star Rating Picker */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setRating(star)}
                                                                    className={`text-xl transition-colors ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
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

                                                    {/* Action Buttons */}
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting || !comment.trim()}
                                                            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isSubmitting ? "Saving..." : "Save Changes"}
                                                        </button>
                                                    </div>
                                                </form>
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

                                {/* 2. OTHER LEARNERS' REVIEW FEEDS */}
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

                                {/* 3. BASE CREATE REVIEW CONTAINER FORM */}
                                {(isAlreadyEnrolled && !userReview) && (
                                    <div className="mt-8 border-t border-gray-100 pt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>

                                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                                            {/* Star Rating Picker */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setRating(star)}
                                                            className={`text-xl transition-colors ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
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
                                                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:bg-gray-50"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting || !comment.trim()}
                                                    className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? "Posting..." : "Submit Review"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky floating Purchase/Call to action card */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
                            <img
                                src={course.data.thumbnail}
                                alt={course.data.name}
                                className="w-full h-48 object-cover border-b border-gray-100"
                            />

                            <div className="p-6">
                                <div className="mb-4">
                                    <span className="text-xs text-gray-400 uppercase font-bold block mb-0.5">Course Access</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-gray-900">
                                            {course.data.price === 0 ? "Free" : `$${course.data.price}`}
                                        </span>
                                        {course.data.price > 0 && <span className="text-sm text-gray-400 line-through">$149.99</span>}
                                    </div>
                                </div>

                                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                    <li className="flex items-center gap-2">⏱️ <span>{course.data.duration} structured video contents</span></li>
                                    <li className="flex items-center gap-2">♾️ <span>Full lifetime access guaranteed</span></li>
                                    <li className="flex items-center gap-2">📜 <span>Certificate of completion included</span></li>
                                </ul>

                                {/* Enrollment Button Component */}
                                {user?.role !== "admin" && (
                                    <div className="mb-4">
                                        {/* @ts-ignore */}
                                        <EnrollButton
                                            courseId={course.data._id}
                                            isPriceFree={course.data.price === 0}
                                            user={user?._id}
                                            isAlreadyEnrolled={isAlreadyEnrolled}
                                        />
                                    </div>
                                )}

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    30-Day Money-Back Guarantee
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
