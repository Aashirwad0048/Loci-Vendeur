import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [itemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Order must have at least one item",
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["placed", "assigned", "dispatched", "delivered", "cancelled"],
      default: "placed",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "released", "refunded"],
      default: "pending",
      index: true,
    },
    city: { type: String, required: true, trim: true, index: true },
    hasDispute: { type: Boolean, default: false, index: true },
    deliveredAt: { type: Date, default: null, index: true },
    razorpayOrderId: { type: String, default: null, index: true },
    razorpayPaymentId: { type: String, default: null },
    paidAt: { type: Date, default: null },
    assignmentDebug: {
      sameCity: { type: Boolean, default: false },
      sameState: { type: Boolean, default: false },
      distanceKm: { type: Number, default: null },
      totalCost: { type: Number, default: null },
      retailerCity: { type: String, default: "" },
      retailerState: { type: String, default: "" },
      wholesalerCity: { type: String, default: "" },
      wholesalerState: { type: String, default: "" },
      rankedBy: {
        type: [String],
        default: ["sameCity", "sameState", "distanceKm", "totalCost"],
      },
    },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, city: 1 });
orderSchema.index({ retailerId: 1, createdAt: -1 });
orderSchema.index({ wholesalerId: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1, city: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1, hasDispute: 1, deliveredAt: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
