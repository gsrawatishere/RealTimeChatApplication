import axios from 'axios';
import toast from 'react-hot-toast';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:4001/api/v1', 
  withCredentials: true, // ✅ Required to send cookies (accessToken, refreshToken)
});

// === Internal State ===
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
};

// === Axios Response Interceptor ===
axiosInstance.interceptors.response.use(
  response => response, // ✅ Success path
  async error => {
    const originalRequest = error.config;

    // === 401: No access token or expired ===
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // 🕒 Wait if refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject: reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post('/auth/refresh-token');

        // ✅ Retry all failed requests in queue
        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        console.error("⚠️ Refresh token failed → Redirecting to login");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // === 403: Token invalid / user not found ===
    if (error.response?.status === 403) {
      console.warn("🔒 Forbidden (403) → Redirecting to login");
      window.location.href = '/login';
      toast.error("Redirecting to login unable to verify")
    }

    return Promise.reject(error); // Other errors
  }
);

