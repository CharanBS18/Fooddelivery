import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { successResponse } from "../../common/utils/ApiResponse.js";
import * as cartService from "./cart.service.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user._id);
  return successResponse(res, StatusCodes.OK, "Cart fetched", cart);
});

export const upsertItem = asyncHandler(async (req, res) => {
  const { menuItemId, quantity } = req.validated.body;
  const cart = await cartService.upsertCartItem(req.user._id, menuItemId, quantity);
  return successResponse(res, StatusCodes.OK, "Cart updated", cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const { menuItemId } = req.validated.params;
  const cart = await cartService.removeCartItem(req.user._id, menuItemId);
  return successResponse(res, StatusCodes.OK, "Cart item removed", cart);
});

export const clear = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  return successResponse(res, StatusCodes.OK, "Cart cleared", cart);
});
