import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { successResponse } from "../../common/utils/ApiResponse.js";
import * as paymentService from "./payment.service.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const result = await paymentService.createRazorpayOrder(req.user._id, req.validated.body.orderId);
  return successResponse(res, StatusCodes.OK, "Payment order created", result);
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const order = await paymentService.verifyRazorpayPayment(req.user._id, req.validated.body);
  return successResponse(res, StatusCodes.OK, "Payment verified", order);
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawPayload = req.body.toString();
  const payload = JSON.parse(rawPayload);

  const isValid = paymentService.verifyWebhookSignature(rawPayload, signature);
  if (!isValid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid webhook signature" });
  }

  const event = payload?.event;
  if (event === "payment.captured") {
    await paymentService.handleWebhookPaymentCaptured(payload);
  }

  return res.status(StatusCodes.OK).json({ success: true });
});
