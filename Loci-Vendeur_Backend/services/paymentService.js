import Razorpay from "razorpay";
import crypto from "crypto";
import env from "../config/env.js";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

export const createRazorpayOrder = async ({ amount, receipt }) => {
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  });
};

export const createPaymentOrderForExistingOrder = async ({ orderId, retailerId }) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  }

  if (String(order.retailerId) !== String(retailerId)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  if (order.paymentStatus === "paid" || order.paymentStatus === "released") {
    throw Object.assign(new Error("Order is already paid"), { statusCode: 400 });
  }

  const razorpayOrder = await createRazorpayOrder({
    amount: order.totalAmount,
    receipt: `order_${order._id}`,
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    order,
    razorpayOrder,
    keyId: env.razorpayKeyId,
  };
};

export const verifyAndCapturePayment = async ({
  orderId,
  retailerId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  }

  if (String(order.retailerId) !== String(retailerId)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  if (!order.razorpayOrderId || order.razorpayOrderId !== razorpayOrderId) {
    throw Object.assign(new Error("Invalid Razorpay order"), { statusCode: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw Object.assign(new Error("Invalid payment signature"), { statusCode: 400 });
  }

  order.paymentStatus = "paid";
  order.razorpayPaymentId = razorpayPaymentId;
  order.paidAt = new Date();
  await order.save();

  return order;
};

export const handlePaymentWebhook = async ({ orderId, status }) => {
  if (status !== "paid") {
    throw Object.assign(new Error("Unsupported payment status"), { statusCode: 400 });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  }

  order.paymentStatus = "paid";
  await order.save();

  return order;
};
