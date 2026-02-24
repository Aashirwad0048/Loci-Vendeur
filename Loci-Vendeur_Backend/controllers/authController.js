import User from "../models/User.js";
import Wholesaler from "../models/Wholesaler.js";
import Retailer from "../models/Retailer.js";
import crypto from "crypto";
import env from "../config/env.js";
import { sendPasswordResetEmail } from "../services/mailService.js";
import { generateToken } from "../utils/generateToken.js";
import { formatResponse } from "../utils/formatResponse.js";

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    role = "retailer",
    city,
    companyName,
    gstin,
    category,
    mov,
    warehouseAddress,
    bankDetails,
    shopPhoto,
    gstFile,
    phone,
    shopName,
    industry,
    address,
    state,
    pincode,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json(formatResponse({ success: false, message: "Email already exists" }));
  }

  if (role === "wholesaler" && (!companyName || !gstin || !warehouseAddress || !bankDetails)) {
    return res.status(400).json(
      formatResponse({ success: false, message: "Wholesaler profile fields are required" })
    );
  }
  if (
    role === "retailer" &&
    (!shopName || !phone || !address || !city || !state || !pincode || !shopPhoto)
  ) {
    return res.status(400).json(
      formatResponse({
        success: false,
        message:
          "Retailer verification fields are required (shop details, contact, address, and shop proof)",
      })
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    city,
    phone: phone || "",
    shopName: role === "retailer" ? shopName || "" : "",
    industry: role === "retailer" ? industry || "" : "",
    gstin: role === "retailer" ? gstin || "" : "",
    address: role === "retailer" ? address || "" : "",
    state: role === "retailer" ? state || "" : "",
    pincode: role === "retailer" ? pincode || "" : "",
    shopPhoto: role === "retailer" ? shopPhoto || null : null,
    status: role === "admin" ? "active" : "pending",
  });

  if (role === "wholesaler") {
    await Wholesaler.create({
      userId: user._id,
      companyName,
      gstin,
      category: category || "",
      mov: Number(mov) || 0,
      warehouseAddress,
      bankDetails,
      gstFile: gstFile || null,
      verificationStatus: "pending",
    });
  } else if (role === "retailer") {
    await Retailer.create({
      userId: user._id,
      shopName: shopName || "",
      industry: industry || "",
      gstin: gstin || "",
      phone: phone || "",
      address: address || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      shopPhoto: shopPhoto || null,
    });
  }

  return res.status(201).json(
    formatResponse({
      message: "Registration submitted. Account will be activated after admin verification.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          city: user.city,
        },
      },
    })
  );
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res
      .status(401)
      .json(formatResponse({ success: false, message: "Invalid credentials" }));
  }

  if (user.status === "suspended") {
    return res.status(403).json(formatResponse({ success: false, message: "Account suspended" }));
  }
  if (user.status === "pending") {
    return res.status(403).json(
      formatResponse({ success: false, message: "Account is pending admin verification" })
    );
  }

  const token = generateToken({ id: user._id, role: user.role });

  return res.json(
    formatResponse({
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          city: user.city,
        },
      },
    })
  );
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  console.info(`[auth:forgot-password] request for ${normalizedEmail} | exists=${Boolean(user)}`);

  if (!user) {
    return res
      .status(404)
      .json(formatResponse({ success: false, message: "Email does not exist", data: null }));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });
    console.info(`[auth:forgot-password] email sent to ${user.email}`);
  } catch (error) {
    console.error(`[auth:forgot-password] email send failed for ${user.email}: ${error.message}`);
    if (env.mailFallbackToConsole) {
      console.warn("[mail-fallback] SMTP send failed. Using dev fallback reset link.");
      console.warn(`[mail-fallback] Reset link for ${user.email}: ${resetUrl}`);
      return res.json(
        formatResponse({
          message: "SMTP failed in dev mode. Use the returned reset link.",
          data: { resetUrl },
        })
      );
    }

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save({ validateBeforeSave: false });
    throw error;
  }

  return res.json(
    formatResponse({
      message: "Password reset instructions were sent",
      data: null,
    })
  );
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+password +resetPasswordToken +resetPasswordExpires");

  if (!user) {
    return res.status(400).json(formatResponse({ success: false, message: "Token is invalid or expired" }));
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return res.json(formatResponse({ message: "Password reset successful" }));
};
