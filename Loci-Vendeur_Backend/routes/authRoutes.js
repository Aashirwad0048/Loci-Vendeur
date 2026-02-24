import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import asyncHandler from "express-async-handler";
import { validateRequired } from "../middleware/validateMiddleware.js";

const router = Router();

router.post("/register", validateRequired(["name", "email", "password", "city"]), asyncHandler(register));
router.post("/login", validateRequired(["email", "password"]), asyncHandler(login));
router.post("/forgot-password", validateRequired(["email"]), asyncHandler(forgotPassword));
router.post("/reset-password/:token", validateRequired(["password"]), asyncHandler(resetPassword));

export default router;

