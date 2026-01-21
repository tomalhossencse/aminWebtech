import axios from "axios";

const getBaseURL = () => {
  // Use environment variable if available, fallback to production server
  return (
    import.meta.env.VITE_API_BASE_URL ||
    "https://amin-web-tech-server.vercel.app"
  );
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. REQUEST INTERCEPTOR: The "Identity Provider"
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      // Attaches the "Passport" (JWT) to the header
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. RESPONSE INTERCEPTOR: The "Session Monitor"
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server says 401 (Unauthorized) or 403 (Forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Session expired or invalid. Logging out...");

      // Clean up the local storage
      localStorage.removeItem("admin_token");

      // Force redirect to login page if we are not already there
      if (!window.location.pathname.includes("/admin")) {
        window.location.replace("/admin");
      }
    }

    return Promise.reject(error);
  },
);

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
