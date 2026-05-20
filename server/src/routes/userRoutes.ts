import express from "express";
import { getLearners, deleteUser, getUserProfile, updateUserProfile, updatePassword, markLessonComplete, enrollInFreeCourse } from "../controllers/userController";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/", protect, adminOnly, asyncHandler(getLearners));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteUser));
router.get("/profile", protect, asyncHandler(getUserProfile));
router.put("/profile", protect, asyncHandler(updateUserProfile));
router.put("/profile/password", protect, adminOnly, asyncHandler(updatePassword));
router.post("/enroll-free", protect, asyncHandler(enrollInFreeCourse));
router.post("/courses/complete-lesson", protect, asyncHandler(markLessonComplete));
export default router;
