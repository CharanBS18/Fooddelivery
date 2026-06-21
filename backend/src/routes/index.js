import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { userRoutes } from "../modules/users/user.routes.js";
import { restaurantRoutes } from "../modules/restaurants/restaurant.routes.js";
import { menuRoutes } from "../modules/menuItems/menu.routes.js";
import { cartRoutes } from "../modules/cart/cart.routes.js";
import { orderRoutes } from "../modules/orders/order.routes.js";
import { paymentRoutes } from "../modules/payments/payment.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/restaurants", restaurantRoutes);
apiRouter.use("/menu-items", menuRoutes);
apiRouter.use("/cart", cartRoutes);
apiRouter.use("/orders", orderRoutes);
apiRouter.use("/payments", paymentRoutes);
