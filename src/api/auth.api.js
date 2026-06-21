import { apiFetch, authToken } from "../lib/http";

export const authApi = {
  async signup(payload) {
    const data = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    authToken.set(data.accessToken);
    return data;
  },

  async login(payload) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    authToken.set(data.accessToken);
    return data;
  },

  me() {
    return apiFetch("/auth/me");
  },

  logout() {
    authToken.clear();
  }
};
