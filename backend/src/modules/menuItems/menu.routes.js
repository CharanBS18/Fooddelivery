import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as controller from "./menu.controller.js";
import { createMenuItemSchema } from "./menu.validator.js";

export const menuRoutes = Router();

menuRoutes.get("/", controller.listMenuItems);
menuRoutes.get("/:menuItemId", controller.getMenuItem);
menuRoutes.post("/", authenticate, authorize("admin"), validate(createMenuItemSchema), controller.createMenuItem);
