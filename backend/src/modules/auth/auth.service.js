import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { User } from "../users/user.model.js";

const signAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiry
  });
};

export const signup = async ({ name, email, password, phone }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, phone });
  const accessToken = signAccessToken(user._id.toString());

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+passwordHash name email role");
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const accessToken = signAccessToken(user._id.toString());
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken
  };
};
