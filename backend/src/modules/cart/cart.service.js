import { ApiError } from "../../common/utils/ApiError.js";
import { MenuItem } from "../menuItems/menu-item.model.js";
import { Cart } from "./cart.model.js";

const recalc = (cart) => {
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalAmount: 0 });
  }
  return cart;
};

export const upsertCartItem = async (userId, menuItemId, quantity) => {
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem || !menuItem.isAvailable) {
    throw new ApiError(400, "Menu item unavailable");
  }

  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((item) => item.menuItem.toString() === menuItemId);

  if (existing) {
    existing.quantity = quantity;
    existing.unitPrice = menuItem.price;
    existing.nameSnapshot = menuItem.name;
  } else {
    cart.items.push({
      menuItem: menuItem._id,
      quantity,
      unitPrice: menuItem.price,
      nameSnapshot: menuItem.name,
      restaurant: menuItem.restaurant
    });
  }

  recalc(cart);
  await cart.save();
  return cart;
};

export const removeCartItem = async (userId, menuItemId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((item) => item.menuItem.toString() !== menuItemId);
  recalc(cart);
  await cart.save();
  return cart;
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();
  return cart;
};
