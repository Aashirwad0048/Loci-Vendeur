import mongoose from "mongoose";

const billItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    invoiceNumber: { type: String, required: true, trim: true, index: true },
    invoiceDate: { type: Date, required: true, index: true },
    items: {
      type: [billItemSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Bill must contain at least one item",
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    taxPercent: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: "Cash", trim: true },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "paid", index: true },
    cashReceived: { type: Number, default: 0, min: 0 },
    shopSnapshot: {
      shopName: { type: String, default: "", trim: true },
      ownerName: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true },
      city: { type: String, default: "", trim: true },
      state: { type: String, default: "", trim: true },
      pincode: { type: String, default: "", trim: true },
      gstin: { type: String, default: "", trim: true },
    },
  },
  { timestamps: true }
);

billSchema.index({ retailerId: 1, createdAt: -1 });
billSchema.index({ retailerId: 1, invoiceNumber: 1 }, { unique: true });

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
