import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    commission: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["held", "released", "refunded"], default: "held", index: true },
    releasedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Escrow = mongoose.model("Escrow", escrowSchema);

export default Escrow;
