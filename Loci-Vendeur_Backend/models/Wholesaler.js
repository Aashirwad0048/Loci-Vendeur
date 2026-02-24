import mongoose from "mongoose";

const wholesalerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    companyName: { type: String, required: true, trim: true },
    gstin: { type: String, required: true, trim: true },
    category: { type: String, default: "", trim: true },
    mov: { type: Number, default: 0, min: 0 },
    warehouseAddress: { type: String, required: true, trim: true },
    bankDetails: {
      accountNumber: { type: String, required: true, trim: true },
      ifsc: { type: String, required: true, trim: true },
    },
    gstFile: { type: String, default: null },
    verificationStatus: { type: String, enum: ["pending", "verified"], default: "pending", index: true },
  },
  { timestamps: true }
);

const Wholesaler = mongoose.model("Wholesaler", wholesalerSchema);

export default Wholesaler;
