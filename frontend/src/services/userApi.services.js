const API_BASE_URL = import.meta.env.VITE_API_URL;

export const logIn = {
  outsideLogin: () => {
    window.location.href = `${API_BASE_URL}/api/user/login/google`;
  },
};