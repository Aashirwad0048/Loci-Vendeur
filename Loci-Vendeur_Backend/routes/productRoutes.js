import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../controllers/productController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import asyncHandler from "express-async-handler";

const router = Router();

router.get("/", optionalProtect, asyncHandler(getProducts));
router.post("/", protect, allowRoles("wholesaler"), asyncHandler(createProduct));
router.put("/:id", protect, allowRoles("wholesaler", "admin"), asyncHandler(updateProduct));
router.delete("/:id", protect, allowRoles("wholesaler", "admin"), asyncHandler(deleteProduct));
router.patch("/:id/status", protect, allowRoles("admin"), asyncHandler(updateProductStatus));

export default router;
