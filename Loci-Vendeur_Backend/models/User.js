import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { hashPassword } from "../utils/hashPassword.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["admin", "retailer", "wholesaler"],
      default: "retailer",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended"],
      default: "pending",
      index: true,
    },
    city: { type: String, required: true, trim: true, index: true },
    phone: { type: String, default: "", trim: true },
    shopName: { type: String, default: "", trim: true },
    industry: { type: String, default: "", trim: true },
    gstin: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    pincode: { type: String, default: "", trim: true },
    shopPhoto: { type: String, default: null },
    resetPasswordToken: { type: String, default: null, select: false },
    resetPasswordExpires: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

  return rawToken;
};

const User = mongoose.model("User", userSchema);

export default User;
