import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import useAxios from './useAxios';

const useServicesAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all services (public endpoint)
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        console.log('📋 Fetching services from backend...');
        const response = await axios.get('/services');
        console.log('✅ Services API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching services:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Get single service by ID
  const useService = (id) => {
    return useQuery({
      queryKey: ['service', id],
      queryFn: async () => {
        const response = await axios.get(`/services/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    });
  };

  // Create service mutation (Admin only)
  const createServiceMutation = useMutation({
    mutationFn: async (serviceData) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📝 Creating service:', serviceData);
        const response = await axios.post('/services', serviceData);
        console.log('✅ Service created:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error creating service:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries(['services']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to create service');
      setLoading(false);
    }
  });

  // Update service mutation (Admin only)
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, serviceData }) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Updating service:', id, serviceData);
        const response = await axios.put(`/services/${id}`, serviceData);
        console.log('✅ Service updated:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error updating service:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries(['services']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to update service');
      setLoading(false);
    }
  });

  // Delete service mutation (Admin only)
  const deleteServiceMutation = useMutation({
    mutationFn: async (id) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🗑️ Deleting service:', id);
        const response = await axios.delete(`/services/${id}`);
        console.log('✅ Service deleted:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error deleting service:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries(['services']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to delete service');
      setLoading(false);
    }
  });

  // Helper functions
  const createService = async (serviceData) => {
    return createServiceMutation.mutateAsync(serviceData);
  };

  const updateService = async (id, serviceData) => {
    return updateServiceMutation.mutateAsync({ id, serviceData });
  };

  const deleteService = async (id) => {
    return deleteServiceMutation.mutateAsync(id);
  };

  // Get filtered services
  const getActiveServices = () => {
    return services.filter(service => service.status === 'Active');
  };

  const getFeaturedServices = () => {
    return services.filter(service => 
      service.status === 'Active' && service.featured === 'Yes'
    );
  };

  // Clear error function
  const clearError = () => setError(null);

  return {
    // Data
    services,
    loading: loading || servicesLoading || 
             createServiceMutation.isPending || 
             updateServiceMutation.isPending || 
             deleteServiceMutation.isPending,
    error: error || servicesError?.message,
    
    // Functions
    createService,
    updateService,
    deleteService,
    refetchServices,
    clearError,
    
    // Filtered data helpers
    getActiveServices,
    getFeaturedServices,
    
    // Single service hook
    useService,
    
    // Mutation states
    createServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  };
};

export default useServicesAPI;