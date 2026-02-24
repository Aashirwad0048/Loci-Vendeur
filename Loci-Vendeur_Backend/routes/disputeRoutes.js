import { Router } from "express";
import { createDispute, getDisputes, resolveDispute } from "../controllers/disputeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/", protect, allowRoles("admin"), asyncHandler(getDisputes));
router.post("/", protect, asyncHandler(createDispute));
router.patch("/:id/resolve", protect, allowRoles("admin"), asyncHandler(resolveDispute));

export default router;
