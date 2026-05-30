import express from "express";
import { getAdminActiveChats, getChatHistory } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

// Learners call /api/chat/history
// Admins call /api/chat/history/LEARNER_ID
router.get("/history/:roomId", protect, asyncHandler(getChatHistory));
router.get("/admin/active-rooms", protect, asyncHandler(getAdminActiveChats));

export default router;
