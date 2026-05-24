import express from "express";
import { getMyNotifications, markNotificationsAsRead } from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/", protect, asyncHandler(getMyNotifications));
router.put("/mark-read", protect, asyncHandler(markNotificationsAsRead));

export default router;
