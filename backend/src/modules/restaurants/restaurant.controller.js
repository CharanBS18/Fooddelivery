import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { successResponse } from "../../common/utils/ApiResponse.js";
import { Restaurant } from "./restaurant.model.js";

export const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create(req.validated.body);
  return successResponse(res, StatusCodes.CREATED, "Restaurant created", restaurant);
});

export const listRestaurants = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  const filter = q ? { $text: { $search: q }, isActive: true } : { isActive: true };
  const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 }).limit(100);
  return successResponse(res, StatusCodes.OK, "Restaurants fetched", restaurants);
});

export const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  return successResponse(res, StatusCodes.OK, "Restaurant fetched", restaurant);
});
