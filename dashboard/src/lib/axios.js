import axios from "axios";

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
});

// Add request interceptor to log API URL for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    const token = window?.localStorage?.getItem("token");
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!apiBaseUrl) {
      console.error("API URL not configured. Check Vercel environment variables.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Setup response interceptor to handle authentication errors
// This should be called after the store is initialized
export const setupAxiosInterceptors = (store, clearAuthAction) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      
      // Handle 401 (Unauthorized) and 403 (Forbidden) errors
      if (status === 401 || status === 403) {
        // Only logout if we're not already on the login page
        // and if the error is not from the login endpoint itself
        const url = error.config?.url || "";
        const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/me");
        
        if (!isAuthEndpoint) {
          // Clear auth state immediately
          store.dispatch(clearAuthAction());
          
          // Redirect to login page if not already there
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
      
      return Promise.reject(error);
    }
  );
};

