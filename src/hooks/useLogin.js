// src/hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "./useAxios";

const useLogin = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      console.log("🔐 Attempting login with:", { username: credentials.username });
      const response = await axios.post("/api/auth/login", credentials);
      console.log("✅ Login response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("🎉 Login successful, data:", data);
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        console.log("🔑 Token stored, navigating to dashboard...");
        navigate("/dashboard");
      } else {
        console.error("❌ No token in response");
      }
    },
    onError: (error) => {
      console.error("❌ Login error:", error);
      console.error("Error response:", error.response?.data);
    },
  });
};
export default useLogin;
