import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import useAxios from './useAxios';

const useActivitiesAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    }
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to get icon from activity type
  const getIconFromType = (type) => {
    switch (type) {
      case 'project_created':
      case 'project_updated':
        return 'FileText';
      case 'blog_published':
      case 'blog_updated':
        return 'FileText';
      case 'service_updated':
        return 'FileText';
      case 'contact_received':
        return 'User';
      case 'media_uploaded':
        return 'FileText';
      case 'testimonial_added':
        return 'User';
      case 'user_login':
      case 'user_logout':
        return 'User';
      default:
        return 'FileText';
    }
  };

  // Get recent activities from backend
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      console.log('📊 Fetching recent activities from backend...');
      const response = await axios.get('/api/activities/recent?limit=6');
      console.log('✅ Activities API response:', response.data);
      
      // Handle different response formats
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Process activities data to ensure proper format
  const activities = activitiesData ? activitiesData.map(activity => ({
    id: activity.id,
    type: activity.type || 'action',
    user: activity.user || 'System',
    action: activity.title || activity.description || 'Unknown action',
    timestamp: formatTimestamp(activity.timestamp),
    date: formatDate(activity.timestamp),
    icon: getIconFromType(activity.type),
    ip: 'N/A' // IP not provided by current backend
  })) : [];

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