import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { successResponse } from "../../common/utils/ApiResponse.js";
import { MenuItem } from "./menu-item.model.js";

export const createMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.create(req.validated.body);
  return successResponse(res, StatusCodes.CREATED, "Menu item created", menuItem);
});

export const listMenuItems = asyncHandler(async (req, res) => {
  const { restaurantId } = req.query;
  const filter = {};
  if (restaurantId) filter.restaurant = restaurantId;

  const items = await MenuItem.find(filter).sort({ createdAt: -1 }).limit(500);
  return successResponse(res, StatusCodes.OK, "Menu items fetched", items);
});

export const getMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.menuItemId);
  return successResponse(res, StatusCodes.OK, "Menu item fetched", item);
});
