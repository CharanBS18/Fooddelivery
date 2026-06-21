import { ApiError } from "../../common/utils/ApiError.js";
import { ORDER_STATUS } from "../../common/constants/order-status.js";
import { Cart } from "../cart/cart.model.js";
import { Order } from "./order.model.js";
import { OrderItem } from "./order-item.model.js";

const DELIVERY_FEE = 39;

export const createOrderFromCart = async (userId, deliveryAddress) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const restaurantIds = new Set(cart.items.map((item) => item.restaurant.toString()));
  if (restaurantIds.size > 1) {
    throw new ApiError(400, "Only one restaurant per order is supported");
  }

  const [restaurant] = [...restaurantIds];
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const order = await Order.create({
    user: userId,
    restaurant,
    subtotalAmount: subtotal,
    deliveryFee: DELIVERY_FEE,
    totalAmount: total,
    status: ORDER_STATUS.PENDING_PAYMENT,
    deliveryAddress
  });

  const orderItems = await OrderItem.insertMany(
    cart.items.map((item) => ({
      order: order._id,
      menuItem: item.menuItem,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      nameSnapshot: item.nameSnapshot,
      restaurant: item.restaurant
    }))
  );

  order.items = orderItems.map((item) => item._id);
  await order.save();

  return order;
};

export const getOrderByIdForUser = async (orderId, userId) => {
  return Order.findOne({ _id: orderId, user: userId }).populate("items");
};

export const listOrdersForUser = async (userId) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 }).populate("items");
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  await order.save();
  return order;
};
