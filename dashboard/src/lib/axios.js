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
  
  // In production, VITE_API_URL must be set
  // This will help catch configuration issues early
  console.error(
    "VITE_API_URL is not set! Please set it in your Vercel environment variables."
  );
  throw new Error(
    "API URL not configured. Please set VITE_API_URL environment variable."
  );
};

export const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

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

