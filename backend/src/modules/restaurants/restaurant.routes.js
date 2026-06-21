import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as controller from "./restaurant.controller.js";
import { createRestaurantSchema } from "./restaurant.validator.js";

export const restaurantRoutes = Router();

restaurantRoutes.get("/", controller.listRestaurants);
restaurantRoutes.get("/:restaurantId", controller.getRestaurantById);
restaurantRoutes.post("/", authenticate, authorize("admin"), validate(createRestaurantSchema), controller.createRestaurant);
