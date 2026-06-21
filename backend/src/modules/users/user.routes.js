import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import * as controller from "./user.controller.js";

export const userRoutes = Router();

userRoutes.get("/me", authenticate, controller.getMyProfile);
userRoutes.get("/", authenticate, authorize("admin"), controller.getUsers);
