import express from "express";
import { addReview, updateReview, deleteReview, toggleLikeReview } from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.post("/:courseId", protect, asyncHandler(addReview));
router.post("/toggle-like/:id", protect, asyncHandler(toggleLikeReview));
router.put("/:id", protect, asyncHandler(updateReview));
router.delete("/:id", protect, asyncHandler(deleteReview));

export default router;
