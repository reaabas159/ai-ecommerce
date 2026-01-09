import axios from "axios";
import { store } from "../store/store";
import { getCurrentUser } from "../store/slices/authSlice";

// Determine API base URL
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use localhost
  if (import.meta.env.MODE === "development" || import.meta.env.DEV) {
    return "http://localhost:4000/api/v1";
  }
  
  // In production, if VITE_API_URL is not set, log error but don't crash
  // Use a fallback that will show clear errors in network requests
  console.error(
    "⚠️ VITE_API_URL is not set! Please set it in your Vercel environment variables."
  );
  console.error(
    "⚠️ API requests will fail. Set VITE_API_URL=https://your-server-url.railway.app/api/v1"
  );
  
  // Return empty string so axios will use relative URLs (won't work but won't crash)
  // This allows the app to load and show proper error messages
  return "";
};

const apiBaseUrl = getApiBaseUrl();

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl || "/api/v1", // Fallback to relative URL if not set
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to log API URL for debugging and ensure credentials
axiosInstance.interceptors.request.use(
  (config) => {
    if (!apiBaseUrl) {
      console.error("API URL not configured. Check Vercel environment variables.");
    }
    // Ensure withCredentials is always true for cookie-based auth
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors and refresh auth
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't already retried, try to refresh auth
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the auth state
        await store.dispatch(getCurrentUser());
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject the original error
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
