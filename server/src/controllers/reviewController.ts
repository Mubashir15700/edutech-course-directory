import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Review from "../models/Review";
import Course from "../models/Course";

export const addReview = async (req: AuthRequest, res: Response) => {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId as string;
    const userId = req.user._id;

    const review = await Review.create({
        user: userId,
        course: courseId,
        rating,
        comment
    });

    const stats = await Review.aggregate([
        { $match: { course: review.course } },
        {
            $group: {
                _id: "$course",
                numReviews: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]);

    // Update the Course document with the fresh averages
    await Course.findByIdAndUpdate(courseId, {
        rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal place (e.g., 4.6)
        numReviews: stats[0].numReviews
    });

    res.status(201).json({ success: true, data: review });
};

export const updateReview = async (req: AuthRequest, res: Response) => {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    if (review.user.toString() !== userId.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this review");
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Recalculate the average rating and number of reviews for the course
    const stats = await Review.aggregate([
        { $match: { course: review.course } },
        {
            $group: {
                _id: "$course",
                numReviews: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]);

    await Course.findByIdAndUpdate(review.course, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews
    });

    res.json({ success: true, data: review });
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    if (review.user.toString() !== userId.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this review");
    }

    await review.deleteOne();

    // Recalculate the average rating and number of reviews for the course
    const stats = await Review.aggregate([
        { $match: { course: review.course } },
        {
            $group: {
                _id: "$course",
                numReviews: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ]);

    await Course.findByIdAndUpdate(review.course, {
        rating: stats[0] ? Math.round(stats[0].avgRating * 10) / 10 : 0,
        numReviews: stats[0] ? stats[0].numReviews : 0
    });

    res.json({ success: true, message: "Review deleted" });
};

export const toggleLikeReview = async (req: AuthRequest, res: Response) => {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    const hasLiked = review.likes.includes(userId);

    if (hasLiked) {
        await Review.findByIdAndUpdate(reviewId, { $pull: { likes: userId } });
    } else {
        await Review.findByIdAndUpdate(reviewId, { $addToSet: { likes: userId } });
    }

    res.json({
        success: true,
        isLiked: !hasLiked,
        likeCount: hasLiked ? review.likes.length - 1 : review.likes.length + 1
    });
};
