import mongoose from "mongoose";

const retailerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    shopName: { type: String, required: true, trim: true },
    industry: { type: String, default: "", trim: true },
    gstin: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true, index: true },
    state: { type: String, default: "", trim: true },
    pincode: { type: String, default: "", trim: true },
    shopPhoto: { type: String, default: null },
  },
  { timestamps: true, collection: "Retail" }
);

const Retailer = mongoose.model("Retailer", retailerSchema);

export default Retailer;
