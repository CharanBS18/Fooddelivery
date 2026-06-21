import { RAZORPAY_KEY_ID } from "../config/api";
import { paymentApi } from "../api/payment.api";

export async function loadRazorpayScript() {
  if (window.Razorpay) return true;

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return Boolean(window.Razorpay);
}

export async function payForOrder(orderId, customer = {}) {
  await loadRazorpayScript();

  const { razorpayOrderId, amount, currency, keyId } = await paymentApi.createRazorpayOrder(orderId);

  return new Promise((resolve, reject) => {
    const instance = new window.Razorpay({
      key: keyId || RAZORPAY_KEY_ID,
      amount,
      currency,
      order_id: razorpayOrderId,
      name: "Food Delivery",
      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.phone || ""
      },
      handler: async (response) => {
        try {
          const verified = await paymentApi.verifyRazorpayPayment({
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
          resolve(verified);
        } catch (err) {
          reject(err);
        }
      }
    });

    instance.on("payment.failed", (error) => reject(error.error));
    instance.open();
  });
}
