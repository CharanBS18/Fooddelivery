import { apiFetch } from "../lib/http";

export const orderApi = {
  create(deliveryAddress) {
    return apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ deliveryAddress })
    });
  },

  listMine() {
    return apiFetch("/orders");
  },

  getById(orderId) {
    return apiFetch(`/orders/${orderId}`);
  },

  updateStatus(orderId, status) {
    return apiFetch(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  }
};
