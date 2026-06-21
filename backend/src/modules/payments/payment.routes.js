import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as controller from "./payment.controller.js";
import { createRazorpayOrderSchema, verifyRazorpayPaymentSchema } from "./payment.validator.js";

export const paymentRoutes = Router();

paymentRoutes.post("/razorpay/webhook", controller.razorpayWebhook);
paymentRoutes.use(authenticate);
paymentRoutes.post("/razorpay/order", validate(createRazorpayOrderSchema), controller.createRazorpayOrder);
paymentRoutes.post("/razorpay/verify", validate(verifyRazorpayPaymentSchema), controller.verifyRazorpayPayment);
