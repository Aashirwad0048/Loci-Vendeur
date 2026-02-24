import { Router } from "express";
import {
  createOrder,
  cancelOrder,
  createOrderPayment,
  getOrderById,
  getOrders,
  updateOrderStatus,
  verifyOrderPayment,
  paymentWebhook,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/", protect, asyncHandler(getOrders));
router.post("/", protect, allowRoles("retailer"), asyncHandler(createOrder));
router.post("/:id/payment/order", protect, allowRoles("retailer"), asyncHandler(createOrderPayment));
router.post("/:id/payment/verify", protect, allowRoles("retailer"), asyncHandler(verifyOrderPayment));
router.post("/payment/webhook", asyncHandler(paymentWebhook));
router.get("/:id", protect, asyncHandler(getOrderById));
router.patch("/:id/status", protect, allowRoles("wholesaler"), asyncHandler(updateOrderStatus));
router.patch("/:id/cancel", protect, allowRoles("retailer", "admin"), asyncHandler(cancelOrder));

export default router;
