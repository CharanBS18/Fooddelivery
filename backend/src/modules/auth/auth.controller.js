import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { successResponse } from "../../common/utils/ApiResponse.js";
import * as authService from "./auth.service.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.validated.body);
  return successResponse(res, StatusCodes.CREATED, "Signup successful", result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);
  return successResponse(res, StatusCodes.OK, "Login successful", result);
});

export const me = asyncHandler(async (req, res) => {
  return successResponse(res, StatusCodes.OK, "Profile fetched", {
    user: req.user
  });
});
