import User from "../models/User.js";
import Wholesaler from "../models/Wholesaler.js";
import Retailer from "../models/Retailer.js";
import { getAnalyticsSummaryData } from "../services/analyticsService.js";
import { formatResponse } from "../utils/formatResponse.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json(formatResponse({ success: false, message: "User not found" }));
  }

  let wholesalerDetails = null;
  let retailerDetails = null;
  if (user.role === "wholesaler") {
    wholesalerDetails = await Wholesaler.findOne({ userId: user._id });
  } else if (user.role === "retailer") {
    retailerDetails = await Retailer.findOne({ userId: user._id });
  }

  return res.json(formatResponse({ data: { ...user.toObject(), wholesalerDetails, retailerDetails } }));
};

export const getUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  const userIds = users.map((u) => u._id);

  const [wholesalers, retailers] = await Promise.all([
    Wholesaler.find({ userId: { $in: userIds } }).lean(),
    Retailer.find({ userId: { $in: userIds } }).lean(),
  ]);

  const wholesalerByUserId = new Map(wholesalers.map((w) => [String(w.userId), w]));
  const retailerByUserId = new Map(retailers.map((r) => [String(r.userId), r]));

  const mergedUsers = users.map((user) => ({
    ...user,
    wholesalerDetails: wholesalerByUserId.get(String(user._id)) || null,
    retailerDetails: retailerByUserId.get(String(user._id)) || null,
  }));

  return res.json(formatResponse({ data: mergedUsers }));
};

export const updateUserStatus = async (req, res) => {
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!user) {
    return res.status(404).json(formatResponse({ success: false, message: "User not found" }));
  }

  return res.json(formatResponse({ message: "User status updated", data: user }));
};

export const updateProfile = async (req, res) => {
  const {
    name,
    city,
    phone,
    shopName,
    industry,
    gstin,
    address,
    state,
    pincode,
    shopPhoto,
    companyName,
    warehouseAddress,
    bankDetails,
  } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json(formatResponse({ success: false, message: "User not found" }));
  }

  if (name !== undefined) user.name = name;
  if (city !== undefined) user.city = city;
  if (phone !== undefined) user.phone = phone;
  if (shopName !== undefined) user.shopName = shopName;
  if (industry !== undefined) user.industry = industry;
  if (gstin !== undefined) user.gstin = gstin;
  if (address !== undefined) user.address = address;
  if (state !== undefined) user.state = state;
  if (pincode !== undefined) user.pincode = pincode;
  if (shopPhoto !== undefined) user.shopPhoto = shopPhoto;
  await user.save();

  let wholesalerDetails = null;
  let retailerDetails = null;

  if (user.role === "retailer") {
    retailerDetails = await Retailer.findOne({ userId: user._id });
    if (!retailerDetails) {
      retailerDetails = await Retailer.create({
        userId: user._id,
        shopName: user.shopName || "",
        industry: user.industry || "",
        gstin: user.gstin || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        shopPhoto: user.shopPhoto || null,
      });
    }

    if (shopName !== undefined) retailerDetails.shopName = shopName;
    if (industry !== undefined) retailerDetails.industry = industry;
    if (gstin !== undefined) retailerDetails.gstin = gstin;
    if (phone !== undefined) retailerDetails.phone = phone;
    if (address !== undefined) retailerDetails.address = address;
    if (city !== undefined) retailerDetails.city = city;
    if (state !== undefined) retailerDetails.state = state;
    if (pincode !== undefined) retailerDetails.pincode = pincode;
    if (shopPhoto !== undefined) retailerDetails.shopPhoto = shopPhoto;
    await retailerDetails.save();
  } else if (user.role === "wholesaler") {
    wholesalerDetails = await Wholesaler.findOne({ userId: user._id });

    if (wholesalerDetails) {
      if (companyName !== undefined) wholesalerDetails.companyName = companyName;
      if (gstin !== undefined) wholesalerDetails.gstin = gstin;
      if (warehouseAddress !== undefined) wholesalerDetails.warehouseAddress = warehouseAddress;
      if (bankDetails?.accountNumber !== undefined) {
        wholesalerDetails.bankDetails.accountNumber = bankDetails.accountNumber;
      }
      if (bankDetails?.ifsc !== undefined) {
        wholesalerDetails.bankDetails.ifsc = bankDetails.ifsc;
      }
      await wholesalerDetails.save();
    }
  }

  return res.json(
    formatResponse({
      message: "Profile updated",
      data: { ...user.toObject(), wholesalerDetails, retailerDetails },
    })
  );
};

export const getAnalyticsSummary = async (_req, res) => {
  const data = await getAnalyticsSummaryData();
  return res.json(formatResponse({ data }));
};
