import axios from "axios";

// Use environment variable for API URL with fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Log the API URL being used (helpful for debugging)
console.log("API Base URL:", API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Keep your existing timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Keep your existing token retrieval logic
    const accessToken = localStorage.getItem("token") || localStorage.getItem("authToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Authorization header set:", `Bearer ${accessToken.substring(0, 10)}...`);
    } else {
      console.log("No token found, request will be unauthenticated");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - keep your existing error handling logic
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);

      if (error.response.status === 401) {
        console.log("Unauthorized - clearing token and redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken"); // Clear both token variants
        localStorage.removeItem("userData"); // Also clear user data as suggested

        // Only redirect to login if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;