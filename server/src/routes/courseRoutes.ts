import express from "express";
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    toggleCourseArchiveStatus,
} from "../controllers/courseController";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import {
    createCourseSchema,
    updateCourseSchema,
} from "../validations/courseValidation";
import { trackUserActivity } from "../middleware/activityMiddleware";

const router = express.Router();

router.use(trackUserActivity); // Apply the activity tracking middleware to all course routes

router.get("/", asyncHandler(getCourses));
router.get("/:id", asyncHandler(getCourseById));
router.post(
    "/",
    protect,
    adminOnly,
    validate(createCourseSchema),
    asyncHandler(createCourse)
);
router.put(
    "/:id",
    protect,
    adminOnly,
    validate(updateCourseSchema),
    asyncHandler(updateCourse)
);
router.patch("/:id", protect, adminOnly, asyncHandler(toggleCourseArchiveStatus));

export default router;
