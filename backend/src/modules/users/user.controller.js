import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { successResponse } from "../../common/utils/ApiResponse.js";
import { User } from "./user.model.js";

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
  return successResponse(res, StatusCodes.OK, "Users fetched", users);
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await User.findById(req.user._id).select("name email role phone addressBook");
  return successResponse(res, StatusCodes.OK, "Profile fetched", profile);
});
