import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../../config/env.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { ORDER_STATUS } from "../../common/constants/order-status.js";
import { Order } from "../orders/order.model.js";
import { Cart } from "../cart/cart.model.js";

const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret
});

export const createRazorpayOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, "Order not found");
  if (order.payment?.isPaid) throw new ApiError(400, "Order already paid");

  const providerOrder = await razorpay.orders.create({
    amount: Math.round(order.totalAmount * 100),
    currency: order.currency,
    receipt: `order_${order._id.toString()}`
  });

  order.payment = {
    ...(order.payment || {}),
    provider: "razorpay",
    providerOrderId: providerOrder.id,
    isPaid: false
  };
  await order.save();

  return {
    keyId: env.razorpayKeyId,
    razorpayOrderId: providerOrder.id,
    amount: providerOrder.amount,
    currency: providerOrder.currency
  };
};

export const verifyRazorpayPayment = async (
  userId,
  { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, "Order not found");

  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  order.payment = {
    provider: "razorpay",
    providerOrderId: razorpayOrderId,
    providerPaymentId: razorpayPaymentId,
    paymentSignature: razorpaySignature,
    isPaid: true
  };
  order.status = ORDER_STATUS.PREPARING;
  await order.save();

  await Cart.updateOne({ user: userId }, { $set: { items: [], totalAmount: 0 } });

  return order;
};

export const verifyWebhookSignature = (payload, signature) => {
  if (typeof signature !== "string") return false;
  if (!env.razorpayWebhookSecret) {
    throw new ApiError(500, "RAZORPAY_WEBHOOK_SECRET is not configured");
  }

  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(payload)
    .digest("hex");

  return expected === signature;
};

export const handleWebhookPaymentCaptured = async (payload) => {
  const paymentEntity = payload?.payload?.payment?.entity;
  const providerOrderId = paymentEntity?.order_id;
  const providerPaymentId = paymentEntity?.id;

  if (!providerOrderId || !providerPaymentId) {
    throw new ApiError(400, "Invalid webhook payload");
  }

  const order = await Order.findOne({
    "payment.providerOrderId": providerOrderId
  });

  if (!order) return null;
  if (order.payment?.isPaid) return order;

  order.payment = {
    provider: "razorpay",
    providerOrderId,
    providerPaymentId,
    paymentSignature: "webhook_verified",
    isPaid: true
  };
  order.status = ORDER_STATUS.PREPARING;
  await order.save();

  await Cart.updateOne({ user: order.user }, { $set: { items: [], totalAmount: 0 } });
  return order;
};
