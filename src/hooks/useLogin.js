// src/hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "./useAxios";

const useLogin = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post("/api/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        navigate("/dashboard");
      }
    },
  });
};
export default useLogin;
