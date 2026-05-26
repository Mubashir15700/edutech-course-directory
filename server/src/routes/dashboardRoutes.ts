import express from "express";
import { getDashboardStats, getLandingPageStats } from "../controllers/dashboardController";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/stats", protect, adminOnly, asyncHandler(getDashboardStats));
router.get("/landing-stats", asyncHandler(getLandingPageStats));

export default router;
