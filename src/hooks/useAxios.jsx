import axios from "axios";

// Determine the base URL based on environment
const getBaseURL = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return "http://localhost:3000"; // Local development server
  }
  
  // Production URL
  return "https://amin-web-tech-server.vercel.app";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
