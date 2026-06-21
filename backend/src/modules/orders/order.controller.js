import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { successResponse } from "../../common/utils/ApiResponse.js";
import * as orderService from "./order.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress } = req.validated.body;
  const order = await orderService.createOrderFromCart(req.user._id, deliveryAddress);
  return successResponse(res, StatusCodes.CREATED, "Order created", order);
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrdersForUser(req.user._id);
  return successResponse(res, StatusCodes.OK, "Orders fetched", orders);
});

export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderByIdForUser(req.params.orderId, req.user._id);
  return successResponse(res, StatusCodes.OK, "Order fetched", order);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.validated.params.orderId, req.validated.body.status);
  return successResponse(res, StatusCodes.OK, "Order status updated", order);
});
