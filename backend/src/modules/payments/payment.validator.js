import { z } from "zod";

export const createRazorpayOrderSchema = z.object({
  body: z.object({
    orderId: z.string()
  })
});

export const verifyRazorpayPaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string()
  })
});
