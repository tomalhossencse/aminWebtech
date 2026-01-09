import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';

const useTestimonialsAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all testimonials
  const {
    data: testimonials = [],
    isLoading: testimonialsLoading,
    error: testimonialsError,
    refetch: refetchTestimonials
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/testimonials');
        return response.data.testimonials || response.data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: async (testimonialData) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.post('/api/testimonials', testimonialData);
        return response.data;
      } catch (error) {
        console.error('Error creating testimonial:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to create testimonial');
      setLoading(false);
    }
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, testimonialData }) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.put(`/api/testimonials/${id}`, testimonialData);
        return response.data;
      } catch (error) {
        console.error('Error updating testimonial:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to update testimonial');
      setLoading(false);
    }
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id) => {
      setLoading(true);
      setError(null);
      
      try {
        await axios.delete(`/api/testimonials/${id}`);
        return id;
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testimonials']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to delete testimonial');
      setLoading(false);
    }
  });

  // Helper functions
  const getTestimonials = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.featured !== undefined) params.append('featured', filters.featured);
      if (filters.active !== undefined) params.append('active', filters.active);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);
      
      const response = await axios.get(`/api/testimonials?${params}`);
      setLoading(false);
      return response.data.testimonials || response.data;
    } catch (error) {
      console.error('Error fetching filtered testimonials:', error);
      setError(error.response?.data?.error || error.message || 'Failed to fetch testimonials');
      setLoading(false);
      return testimonials; // Return cached data on error
    }
  };

  const createTestimonial = async (testimonialData) => {
    return createTestimonialMutation.mutateAsync(testimonialData);
  };

  const updateTestimonial = async (id, testimonialData) => {
    return updateTestimonialMutation.mutateAsync({ id, testimonialData });
  };

  const deleteTestimonial = async (id) => {
    return deleteTestimonialMutation.mutateAsync(id);
  };

  const toggleFeatured = async (id, featured) => {
    try {
      await axios.put(`/api/testimonials/${id}/featured`, { featured });
      queryClient.invalidateQueries(['testimonials']);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  };

  const toggleActive = async (id, active) => {
    try {
      await axios.put(`/api/testimonials/${id}/active`, { active });
      queryClient.invalidateQueries(['testimonials']);
    } catch (error) {
      console.error('Error toggling active status:', error);
      throw error;
    }
  };

  // Clear error function
  const clearError = () => setError(null);

  return {
    // Data
    testimonials,
    loading: loading || testimonialsLoading || 
             createTestimonialMutation.isPending || 
             updateTestimonialMutation.isPending || 
             deleteTestimonialMutation.isPending,
    error: error || testimonialsError?.message,
    
    // Functions
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleFeatured,
    toggleActive,
    refetchTestimonials,
    clearError,
    
    // Mutation states
    createTestimonialMutation,
    updateTestimonialMutation,
    deleteTestimonialMutation
  };
};

export default useTestimonialsAPI;