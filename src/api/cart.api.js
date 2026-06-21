import { apiFetch } from "../lib/http";

export const cartApi = {
  get() {
    return apiFetch("/cart");
  },

  upsertItem(menuItemId, quantity) {
    return apiFetch("/cart/items", {
      method: "PUT",
      body: JSON.stringify({ menuItemId, quantity })
    });
  },

  removeItem(menuItemId) {
    return apiFetch(`/cart/items/${menuItemId}`, {
      method: "DELETE"
    });
  },

  clear() {
    return apiFetch("/cart", { method: "DELETE" });
  }
};
