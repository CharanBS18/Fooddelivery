import mongoose from "mongoose";
import { ORDER_STATUS } from "../../common/constants/order-status.js";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
    subtotalAmount: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING_PAYMENT
    },
    payment: {
      provider: { type: String, enum: ["razorpay", "stripe"], default: "razorpay" },
      providerOrderId: String,
      providerPaymentId: String,
      paymentSignature: String,
      isPaid: { type: Boolean, default: false }
    },
    deliveryAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
