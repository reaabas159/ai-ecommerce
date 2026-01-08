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
