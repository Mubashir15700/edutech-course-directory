import express from "express";
import { login, register } from "../controllers/authController";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validations/authValidation";

const router = express.Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

export default router;
