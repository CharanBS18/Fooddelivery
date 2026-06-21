import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import * as controller from "./auth.controller.js";
import { loginSchema, signupSchema } from "./auth.validator.js";

export const authRoutes = Router();

authRoutes.post("/signup", validate(signupSchema), controller.signup);
authRoutes.post("/login", validate(loginSchema), controller.login);
authRoutes.get("/me", authenticate, controller.me);
