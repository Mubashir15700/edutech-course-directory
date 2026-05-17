import express from "express";
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/ courseController";
import { adminOnly, protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getCourses);
router.post("/", protect, adminOnly, createCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

export default router;
