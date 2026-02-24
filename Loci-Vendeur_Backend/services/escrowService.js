import mongoose from "mongoose";
import Escrow from "../models/Escrow.js";
import Order from "../models/Order.js";

const validateOrderForEscrowRelease = (order) => {
  if (!order) {
    throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  }

  if (order.hasDispute) {
    throw Object.assign(new Error("Escrow release blocked due to dispute"), { statusCode: 400 });
  }

  if (order.status !== "delivered") {
    throw Object.assign(new Error("Order must be delivered first"), { statusCode: 400 });
  }

  if (order.paymentStatus !== "paid") {
    throw Object.assign(new Error("Order is not paid"), { statusCode: 400 });
  }
};

export const releaseEscrowForOrder = async (orderId, { session: externalSession } = {}) => {
  const execute = async (session) => {
    const order = await Order.findById(orderId).session(session);
    validateOrderForEscrowRelease(order);

    const escrow = await Escrow.findOne({ orderId }).session(session);
    if (!escrow) {
      throw Object.assign(new Error("Escrow record not found"), { statusCode: 404 });
    }

    if (escrow.status !== "held") {
      throw Object.assign(new Error("Escrow already processed"), { statusCode: 400 });
    }

    escrow.status = "released";
    escrow.releasedAt = new Date();
    await escrow.save({ session });

    order.paymentStatus = "released";
    await order.save({ session });

    return {
      orderId: String(order._id),
      payoutAmount: escrow.amount - escrow.commission,
      commission: escrow.commission,
      releasedAt: escrow.releasedAt,
    };
  };

  if (externalSession) {
    return execute(externalSession);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = await execute(session);
    await session.commitTransaction();
    return data;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const autoReleaseEligibleEscrows = async ({ holdHours = 24, batchSize = 50 } = {}) => {
  const cutoff = new Date(Date.now() - holdHours * 60 * 60 * 1000);

  const eligibleOrders = await Order.find({
    status: "delivered",
    paymentStatus: "paid",
    hasDispute: false,
    deliveredAt: { $ne: null, $lte: cutoff },
  })
    .select("_id")
    .sort({ deliveredAt: 1 })
    .limit(batchSize);

  let released = 0;
  const failed = [];

  for (const order of eligibleOrders) {
    try {
      await releaseEscrowForOrder(order._id);
      released += 1;
    } catch (error) {
      failed.push({
        orderId: String(order._id),
        message: error.message || "Failed to release escrow",
      });
    }
  }

  return {
    scanned: eligibleOrders.length,
    released,
    failedCount: failed.length,
    failed,
    cutoff,
  };
};
