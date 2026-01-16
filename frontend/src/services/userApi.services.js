const API_BASE_URL = import.meta.env.VITE_API_URL;
export const userApi = {
  outsideLogin: () => {
    if (!API_BASE_URL) {
      console.error("Missing url");
      return;
    }
    window.location.href = `${API_BASE_URL}/api/user/login/google`;
  },
};