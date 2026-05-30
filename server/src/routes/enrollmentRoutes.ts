import express from "express";
import { createCheckoutSession, getLearnerPurchaseHistory, getAdminUserPurchaseHistory, verifySession } from "../controllers/enrollmentController";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.post("/checkout", protect, asyncHandler(createCheckoutSession));
router.post("/verify-session", protect, asyncHandler(verifySession));
router.get("/purchase-history", protect, asyncHandler(getLearnerPurchaseHistory));
router.get("/admin/purchase-history/:userId", protect, adminOnly, asyncHandler(getAdminUserPurchaseHistory));

export default router;
