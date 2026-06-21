import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as controller from "./order.controller.js";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validator.js";

export const orderRoutes = Router();

orderRoutes.use(authenticate);
orderRoutes.post("/", validate(createOrderSchema), controller.createOrder);
orderRoutes.get("/", controller.listMyOrders);
orderRoutes.get("/:orderId", controller.getMyOrderById);
orderRoutes.patch("/:orderId/status", authorize("admin", "delivery"), validate(updateOrderStatusSchema), controller.updateStatus);
