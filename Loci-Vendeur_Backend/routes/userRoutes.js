import { Router } from "express";
import {
  getProfile,
  getUsers,
  updateUserStatus,
  getAnalyticsSummary,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/me", protect, asyncHandler(getProfile));
router.patch("/me", protect, asyncHandler(updateProfile));
router.get("/", protect, allowRoles("admin"), asyncHandler(getUsers));
router.patch("/:id/status", protect, allowRoles("admin"), asyncHandler(updateUserStatus));
router.get("/analytics/summary", protect, allowRoles("admin"), asyncHandler(getAnalyticsSummary));

export default router;

