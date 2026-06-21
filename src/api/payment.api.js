import { apiFetch } from "../lib/http";

export const paymentApi = {
  createRazorpayOrder(orderId) {
    return apiFetch("/payments/razorpay/order", {
      method: "POST",
      body: JSON.stringify({ orderId })
    });
  },

  verifyRazorpayPayment(payload) {
    return apiFetch("/payments/razorpay/verify", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
