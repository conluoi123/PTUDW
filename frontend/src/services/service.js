import axios from "axios";

// Xử lý nếu không xác thực được lại bằng refresh token thì ra login page
let onLogout = () => {};

export const setLogoutHandler = (logoutContext) => {
  onLogout = logoutContext;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_X_API_KEY,
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((p) => {
        error ? p.reject(error) : p.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject: (err) => reject(err),
                });
            });
        }
        isRefreshing = true;
        try {
            await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/refreshAccessToken`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
        },
      );
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
              if (onLogout) onLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;