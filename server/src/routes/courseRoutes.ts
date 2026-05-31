import express from "express";
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    toggleCourseArchiveStatus,
} from "../controllers/courseController";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { trackUserActivity } from "../middleware/activityMiddleware";
import {
    createCourseSchema,
    updateCourseSchema,
} from "../validations/courseValidation";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadThumbnail } from "../config/cloudinary";

const router = express.Router();

router.use(trackUserActivity); // Apply the activity tracking middleware to all course routes

router.get("/", asyncHandler(getCourses));
router.get("/:id", asyncHandler(getCourseById));
// Intercept file -> parse text body fields -> validate final object -> save
router.post(
    "/",
    protect,
    adminOnly,
    uploadThumbnail.single("thumbnail"), // Intercept binary streams
    (req, res, next) => {
        if (req.file) {
            req.body.thumbnail = req.file.path; // Inject the Cloudinary secure URL into the body
        }
        next();
    },
    validate(createCourseSchema),
    asyncHandler(createCourse)
);

// Thumbnail is optional here in case they are only editing text fields
router.put(
    "/:id",
    protect,
    adminOnly,
    uploadThumbnail.single("thumbnail"),
    (req, res, next) => {
        if (req.file) {
            req.body.thumbnail = req.file.path;
        }
        next();
    },
    validate(updateCourseSchema),
    asyncHandler(updateCourse)
);
router.patch("/:id", protect, adminOnly, asyncHandler(toggleCourseArchiveStatus));

export default router;
