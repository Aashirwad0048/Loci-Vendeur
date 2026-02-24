import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    minOrderQty: { type: Number, default: 1, min: 1 },
    city: { type: String, required: true, trim: true, index: true },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true, index: true },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ city: 1, isActive: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
