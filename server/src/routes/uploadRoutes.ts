import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { uploadVideo } from "../config/cloudinary";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
    "/video",
    protect,
    adminOnly,
    uploadVideo.single("video"), // Intercept file field named 'video'
    asyncHandler(async (req: any, res: any) => {
        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded." });
        }

        // Return the secure Cloudinary streaming CDN link back to the frontend
        res.status(200).json({
            videoUrl: req.file.path,
        });
    })
);

export default router;
