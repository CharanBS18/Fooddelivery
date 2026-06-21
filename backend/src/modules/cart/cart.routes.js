import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as controller from "./cart.controller.js";
import { removeCartItemSchema, upsertCartItemSchema } from "./cart.validator.js";

export const cartRoutes = Router();

cartRoutes.use(authenticate);
cartRoutes.get("/", controller.getCart);
cartRoutes.put("/items", validate(upsertCartItemSchema), controller.upsertItem);
cartRoutes.delete("/items/:menuItemId", validate(removeCartItemSchema), controller.removeItem);
cartRoutes.delete("/", controller.clear);
