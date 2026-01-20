import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getBaseURL = () => {
  return "http://localhost:3000";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useServicesAPI = () => {
  // Get all services (public endpoint)
  const useServices = () => {
    return useQuery({
      queryKey: ["services"],
      queryFn: async () => {
        const response = await axiosInstance.get("/services");
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get single service by ID
  const useService = (id) => {
    return useQuery({
      queryKey: ["service", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/services/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    });
  };

  // Get active services only
  const useActiveServices = () => {
    return useQuery({
      queryKey: ["services", "active"],
      queryFn: async () => {
        const response = await axiosInstance.get("/services");
        return response.data.filter(service => service.status === "Active");
      },
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    });
  };

  // Get featured services only
  const useFeaturedServices = () => {
    return useQuery({
      queryKey: ["services", "featured"],
      queryFn: async () => {
        const response = await axiosInstance.get("/services");
        return response.data.filter(service => 
          service.status === "Active" && service.featured === "Yes"
        );
      },
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    });
  };

  return {
    useServices,
    useService,
    useActiveServices,
    useFeaturedServices,
  };
};