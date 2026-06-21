import { apiFetch } from "../lib/http";

export const restaurantApi = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/restaurants${query ? `?${query}` : ""}`);
  },

  getById(restaurantId) {
    return apiFetch(`/restaurants/${restaurantId}`);
  },

  menu(restaurantId) {
    return apiFetch(`/menu-items?restaurantId=${restaurantId}`);
  }
};
