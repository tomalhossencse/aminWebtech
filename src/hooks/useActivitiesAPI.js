import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import useAxios from './useAxios';

const useActivitiesAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get recent activities from backend
  const {
    data: activities = [],
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      try {
        console.log('📊 Fetching recent activities from backend...');
        const response = await axios.get('/api/activities/recent?limit=6');
        console.log('✅ Activities API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching activities:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Return empty array if server is not available
        console.log('🔄 Using empty array for activities');
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  // Clear activities mutation
  const clearActivitiesMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🗑️ Clearing all activities...');
        const response = await axios.delete('/api/activities/clear');
        console.log('✅ Activities cleared:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error clearing activities:', error);
        console.error('Error details:', error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch activities
      queryClient.invalidateQueries(['recent-activities']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to clear activities');
      setLoading(false);
    }
  });

  // Create activity mutation (for manual logging)
  const createActivityMutation = useMutation({
    mutationFn: async ({ type, action, user, metadata }) => {
      try {
        console.log('📝 Creating activity:', { type, action, user });
        const response = await axios.post('/api/activities', {
          type,
          action,
          user,
          metadata
        });
        console.log('✅ Activity created:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error creating activity:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch activities
      queryClient.invalidateQueries(['recent-activities']);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to create activity');
    }
  });

  // Helper functions
  const clearActivities = async () => {
    return clearActivitiesMutation.mutateAsync();
  };

  const createActivity = async (type, action, user = 'Admin', metadata = {}) => {
    return createActivityMutation.mutateAsync({ type, action, user, metadata });
  };

  // Clear error function
  const clearError = () => setError(null);

  return {
    // Data
    activities,
    loading: loading || activitiesLoading || 
             clearActivitiesMutation.isPending || 
             createActivityMutation.isPending,
    error: error || activitiesError?.message,
    
    // Functions
    clearActivities,
    createActivity,
    refetchActivities,
    clearError,
    
    // Mutation states
    clearActivitiesMutation,
    createActivityMutation
  };
};

export default useActivitiesAPI;