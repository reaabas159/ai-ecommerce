import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "/api/v1",
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

