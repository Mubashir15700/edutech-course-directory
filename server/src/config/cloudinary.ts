import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for Course Thumbnails
const thumbnailStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "edutech/thumbnails",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
});

// Storage configuration for Lesson Videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "edutech/videos",
        resource_type: "video", // Critical for processing MP4/MOV files
        allowed_formats: ["mp4", "mkv", "mov"],
    }),
});

export const uploadThumbnail = multer({ storage: thumbnailStorage });
export const uploadVideo = multer({ storage: videoStorage });
