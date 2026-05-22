import express from "express";
import { getLearners, toggleUserStatus, getUserProfile, updateUserProfile, updatePassword, markLessonComplete } from "../controllers/userController";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/", protect, adminOnly, asyncHandler(getLearners));
router.patch("/:id", protect, adminOnly, asyncHandler(toggleUserStatus));
router.get("/profile", protect, asyncHandler(getUserProfile));
router.put("/profile", protect, asyncHandler(updateUserProfile));
router.put("/profile/password", protect, adminOnly, asyncHandler(updatePassword));
router.post("/courses/complete-lesson", protect, asyncHandler(markLessonComplete));

export default router;
