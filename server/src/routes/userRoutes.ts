import express from "express";
import {
    getLearners,
    deleteUser,
} from "../controllers/userController";
import { adminOnly, protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, adminOnly, getLearners);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
