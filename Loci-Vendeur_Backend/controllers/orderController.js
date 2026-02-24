import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Escrow from "../models/Escrow.js";
import User from "../models/User.js";
import env from "../config/env.js";
import { assignWholesalerByItems } from "../services/assignmentService.js";
import {
  createPaymentOrderForExistingOrder,
  handlePaymentWebhook,
  verifyAndCapturePayment,
} from "../services/paymentService.js";
import { formatResponse } from "../utils/formatResponse.js";

const validTransitions = {
  assigned: ["dispatched"],
  dispatched: ["delivered"],
  delivered: [],
};

export const createOrder = async (req, res) => {
  const { items, city } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json(formatResponse({ success: false, message: "Items are required" }));
  }

  const retailer = await User.findById(req.user.id).select("city state");
  const assignment = await assignWholesalerByItems(items, {
    city: retailer?.city || city,
    state: retailer?.state || "",
  });
  const wholesalerId = assignment.wholesalerId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productIds = assignment.resolvedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true }).session(session);
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let totalAmount = 0;

    for (const item of assignment.resolvedItems) {
      const product = productMap.get(String(item.productId));

      if (!product || product.stock < item.quantity) {
        throw Object.assign(new Error("Insufficient stock"), { statusCode: 400 });
      }

      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({ productId: product._id, quantity: item.quantity, price: product.price });
      totalAmount += product.price * item.quantity;
    }

    const [order] = await Order.create(
      [
        {
          retailerId: req.user.id,
          wholesalerId,
          items: orderItems,
          totalAmount,
          city: city || retailer?.city || "",
          status: "assigned",
          paymentStatus: "pending",
          assignmentDebug: assignment.assignmentDebug || undefined,
        },
      ],
      { session }
    );

    const commission = Number((totalAmount * env.commissionRate).toFixed(2));

    await Escrow.create(
      [
        {
          orderId: order._id,
          amount: totalAmount,
          commission,
          status: "held",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return res.status(201).json(formatResponse({ message: "Order placed", data: order }));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getOrders = async (req, res) => {
  const {
    page: pageQuery = "1",
    limit: limitQuery = "10",
    status,
    paymentStatus,
    city,
    from,
    to,
  } = req.query;

  const page = Math.max(parseInt(pageQuery, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(limitQuery, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filters = {};

  if (req.user.role === "retailer") {
    filters.retailerId = req.user.id;
  } else if (req.user.role === "wholesaler") {
    filters.wholesalerId = req.user.id;
  }

  if (status) {
    filters.status = status;
  }

  if (paymentStatus) {
    filters.paymentStatus = paymentStatus;
  }

  if (city) {
    filters.city = city;
  }

  if (from || to) {
    filters.createdAt = {};
    if (from) {
      const fromDate = new Date(from);
      if (!Number.isNaN(fromDate.getTime())) {
        filters.createdAt.$gte = fromDate;
      }
    }
    if (to) {
      const toDate = new Date(to);
      if (!Number.isNaN(toDate.getTime())) {
        filters.createdAt.$lte = toDate;
      }
    }
    if (Object.keys(filters.createdAt).length === 0) {
      delete filters.createdAt;
    }
  }

  const [orders, total] = await Promise.all([
    Order.find(filters)
      .populate("retailerId", "name email city")
      .populate("wholesalerId", "name email")
      .populate("items.productId", "name image category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return res.json({
    ...formatResponse({ data: orders }),
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

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("retailerId", "name email city")
    .populate("wholesalerId", "name email")
    .populate("items.productId", "name price image category");

  if (!order) {
    return res.status(404).json(formatResponse({ success: false, message: "Order not found" }));
  }

  const canView =
    req.user.role === "admin" ||
    String(order.retailerId?._id) === String(req.user.id) ||
    String(order.wholesalerId?._id) === String(req.user.id);

  if (!canView) {
    return res.status(403).json(formatResponse({ success: false, message: "Forbidden" }));
  }

  return res.json(formatResponse({ data: order }));
};

export const updateOrderStatus = async (req, res) => {
  const { status: newStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json(formatResponse({ success: false, message: "Order not found" }));
  }

  if (!validTransitions[order.status]?.includes(newStatus)) {
    return res.status(400).json(
      formatResponse({ success: false, message: `Cannot move from ${order.status} to ${newStatus}` })
    );
  }

  if (req.user.role !== "wholesaler") {
    return res.status(403).json(formatResponse({ success: false, message: "Only wholesaler can update delivery status" }));
  }

  if (String(order.wholesalerId) !== String(req.user.id)) {
    return res.status(403).json(formatResponse({ success: false, message: "Forbidden" }));
  }

  order.status = newStatus;
  order.deliveredAt = newStatus === "delivered" ? new Date() : null;
  await order.save();

  return res.json(formatResponse({ message: "Order status updated", data: order }));
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json(formatResponse({ success: false, message: "Order not found" }));
  }

  const isAdmin = req.user.role === "admin";
  const isRetailerOwner = req.user.role === "retailer" && String(order.retailerId) === String(req.user.id);

  if (!isAdmin && !isRetailerOwner) {
    return res.status(403).json(formatResponse({ success: false, message: "Forbidden" }));
  }

  if (order.status !== "assigned") {
    return res.status(400).json(
      formatResponse({ success: false, message: "Only assigned orders can be cancelled" })
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    order.status = "cancelled";
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }
    await order.save({ session });

    const escrow = await Escrow.findOne({ orderId: order._id }).session(session);
    if (escrow) {
      escrow.status = "refunded";
      escrow.releasedAt = new Date();
      await escrow.save({ session });
    }

    await session.commitTransaction();
    return res.json(formatResponse({ message: "Order cancelled", data: order }));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const paymentWebhook = async (req, res) => {
  const order = await handlePaymentWebhook(req.body);
  return res.json(formatResponse({ message: "Payment updated", data: order }));
};

export const createOrderPayment = async (req, res) => {
  const { order, razorpayOrder, keyId } = await createPaymentOrderForExistingOrder({
    orderId: req.params.id,
    retailerId: req.user.id,
  });

  return res.json(
    formatResponse({
      message: "Payment order created",
      data: {
        orderId: order._id,
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        razorpayOrderId: razorpayOrder.id,
        keyId,
      },
    })
  );
};

export const verifyOrderPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = await verifyAndCapturePayment({
    orderId: req.params.id,
    retailerId: req.user.id,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return res.json(formatResponse({ message: "Payment verified", data: order }));
};
