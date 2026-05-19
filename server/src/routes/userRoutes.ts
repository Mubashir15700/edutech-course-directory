import express from "express";
import { getLearners, deleteUser } from "../controllers/userController";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.get("/", protect, adminOnly, asyncHandler(getLearners));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteUser));

export default router;
