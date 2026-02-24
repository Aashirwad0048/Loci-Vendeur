import { Router } from "express";
import asyncHandler from "express-async-handler";
import { createBill, getBillById, getBills } from "../controllers/billController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", protect, allowRoles("retailer", "admin"), asyncHandler(getBills));
router.post("/", protect, allowRoles("retailer"), asyncHandler(createBill));
router.get("/:id", protect, allowRoles("retailer", "admin"), asyncHandler(getBillById));

export default router;
