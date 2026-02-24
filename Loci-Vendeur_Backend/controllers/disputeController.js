import Dispute from "../models/Dispute.js";
import Order from "../models/Order.js";
import Escrow from "../models/Escrow.js";
import { formatResponse } from "../utils/formatResponse.js";

export const getDisputes = async (_req, res) => {
  const disputes = await Dispute.find()
    .populate("raisedBy", "name role")
    .populate({
      path: "orderId",
      populate: [
        { path: "retailerId", select: "name" },
        { path: "wholesalerId", select: "name" },
      ],
    })
    .sort({ createdAt: -1 });

  return res.json(formatResponse({ data: disputes }));
};

export const createDispute = async (req, res) => {
  const { orderId, reason, description } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json(formatResponse({ success: false, message: "Order not found" }));
  }

  const canRaise =
    String(order.retailerId) === String(req.user.id) ||
    String(order.wholesalerId) === String(req.user.id) ||
    req.user.role === "admin";

  if (!canRaise) {
    return res.status(403).json(formatResponse({ success: false, message: "Forbidden" }));
  }

  const dispute = await Dispute.create({
    orderId,
    raisedBy: req.user.id,
    reason,
    description,
    status: "open",
  });

  order.hasDispute = true;
  await order.save();

  return res.status(201).json(formatResponse({ message: "Dispute created", data: dispute }));
};

export const resolveDispute = async (req, res) => {
  const { status, action } = req.body;
  const dispute = await Dispute.findById(req.params.id);

  if (!dispute) {
    return res.status(404).json(formatResponse({ success: false, message: "Dispute not found" }));
  }

  dispute.status = status;
  await dispute.save();

  const order = await Order.findById(dispute.orderId);
  if (order && ["resolved", "rejected"].includes(status)) {
    order.hasDispute = false;

    if (action === "refund") {
      order.paymentStatus = "refunded";
      const escrow = await Escrow.findOne({ orderId: order._id });
      if (escrow && escrow.status === "held") {
        escrow.status = "refunded";
        await escrow.save();
      }
    }

    await order.save();
  }

  return res.json(formatResponse({ message: "Dispute updated", data: dispute }));
};
