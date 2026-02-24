import { Router } from "express";
import { releaseEscrow } from "../controllers/escrowController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import asyncHandler from "express-async-handler";

const router = Router();

router.post("/:orderId/release", protect, allowRoles("admin"), asyncHandler(releaseEscrow));

export default router;

