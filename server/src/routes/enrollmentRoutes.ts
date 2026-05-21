import express from "express";
import { createCheckoutSession, verifySession } from "../controllers/enrollmentController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.post("/checkout", protect, asyncHandler(createCheckoutSession));
router.post("/verify-session", protect, asyncHandler(verifySession));

export default router;
