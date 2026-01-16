const API_BASE_URL = import.meta.env.VITE_API_URL;
import api from "./service";
export const userApi = {
  login: async ({ username, password }) => {
    try {
      const res = await api.post("/api/user/login", {
        username,
        password,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  register: async ({ name, username, password, role, email, phone }) => {
    try {
      const res = await api.post("/api/user/register", {
        name,
        username,
        password,
        role,
        email,
        phone,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post("/api/user/logout");
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  outsideLogin: () => {
    if (!API_BASE_URL) {
      console.error("Missing url");
      return;
    }
    window.location.href = `${API_BASE_URL}/api/user/login/google`;
  },
};