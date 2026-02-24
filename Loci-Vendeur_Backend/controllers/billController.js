import Bill from "../models/Bill.js";
import User from "../models/User.js";
import Retailer from "../models/Retailer.js";
import { formatResponse } from "../utils/formatResponse.js";

export const createBill = async (req, res) => {
  const {
    invoiceNumber,
    invoiceDate,
    items,
    subtotal,
    discountPercent,
    discountAmount,
    taxPercent,
    taxAmount,
    total,
    paymentMethod,
    paymentStatus,
    cashReceived,
  } = req.body;

  if (!invoiceNumber || !invoiceDate || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json(formatResponse({ success: false, message: "Invalid bill payload" }));
  }

  const user = await User.findById(req.user.id);
  if (!user || user.role !== "retailer") {
    return res.status(403).json(formatResponse({ success: false, message: "Only retailers can create bills" }));
  }

  const retailer = await Retailer.findOne({ userId: user._id });

  const bill = await Bill.create({
    retailerId: user._id,
    invoiceNumber,
    invoiceDate: new Date(invoiceDate),
    items: items.map((item) => ({
      name: item.name,
      qty: Number(item.qty),
      price: Number(item.price),
      lineTotal: Number(item.lineTotal),
    })),
    subtotal: Number(subtotal || 0),
    discountPercent: Number(discountPercent || 0),
    discountAmount: Number(discountAmount || 0),
    taxPercent: Number(taxPercent || 0),
    taxAmount: Number(taxAmount || 0),
    total: Number(total || 0),
    paymentMethod: paymentMethod || "Cash",
    paymentStatus: paymentStatus || "paid",
    cashReceived: Number(cashReceived || 0),
    shopSnapshot: {
      shopName: retailer?.shopName || user.shopName || "",
      ownerName: user.name || "",
      phone: retailer?.phone || user.phone || "",
      address: retailer?.address || user.address || "",
      city: retailer?.city || user.city || "",
      state: retailer?.state || user.state || "",
      pincode: retailer?.pincode || user.pincode || "",
      gstin: retailer?.gstin || user.gstin || "",
    },
  });

  return res.status(201).json(formatResponse({ message: "Bill created", data: bill }));
};

export const getBills = async (req, res) => {
  const { page: pageQuery = "1", limit: limitQuery = "20", q = "" } = req.query;
  const page = Math.max(parseInt(pageQuery, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(limitQuery, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.user.role === "retailer") {
    filters.retailerId = req.user.id;
  }

  if (q) {
    filters.invoiceNumber = { $regex: String(q).trim(), $options: "i" };
  }

  const [bills, total] = await Promise.all([
    Bill.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Bill.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return res.json({
    ...formatResponse({ data: bills }),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

export const getBillById = async (req, res) => {
  const bill = await Bill.findById(req.params.id).populate("retailerId", "name email");

  if (!bill) {
    return res.status(404).json(formatResponse({ success: false, message: "Bill not found" }));
  }

  const canView = req.user.role === "admin" || String(bill.retailerId?._id || bill.retailerId) === String(req.user.id);
  if (!canView) {
    return res.status(403).json(formatResponse({ success: false, message: "Forbidden" }));
  }

  return res.json(formatResponse({ data: bill }));
};
