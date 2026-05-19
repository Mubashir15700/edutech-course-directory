import express from "express";
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/courseController";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import {
    createCourseSchema,
    updateCourseSchema,
} from "../validations/courseValidation";

const router = express.Router();

router.get("/", protect, asyncHandler(getCourses));
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
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCourse));

export default router;
