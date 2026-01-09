import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';

const useActivitiesAPI = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for activities (since there's no specific activities endpoint)
  const mockActivities = [
    {
      id: 1,
      user: 'Super Admin',
      action: 'Logged in: User logged in',
      timestamp: '30 minutes ago',
      date: new Date().toLocaleString('en-GB'),
      ip: '122.152.51.53',
      type: 'login',
      icon: 'User'
    },
    {
      id: 2,
      user: 'Super Admin',
      action: 'Updated contact status',
      timestamp: '2 hours ago',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('en-GB'),
      ip: '122.152.51.53',
      type: 'action',
      icon: 'FileText'
    },
    {
      id: 3,
      user: 'Super Admin',
      action: 'Created new blog post',
      timestamp: '1 day ago',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-GB'),
      ip: '122.152.51.53',
      type: 'action',
      icon: 'FileText'
    },
    {
      id: 4,
      user: 'Super Admin',
      action: 'Added new team member',
      timestamp: '2 days ago',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('en-GB'),
      ip: '122.152.51.53',
      type: 'action',
      icon: 'FileText'
    },
    {
      id: 5,
      user: 'Super Admin',
      action: 'Updated project information',
      timestamp: '3 days ago',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('en-GB'),
      ip: '122.152.51.53',
      type: 'action',
      icon: 'FileText'
    },
    {
      id: 6,
      user: 'Super Admin',
      action: 'Logged in: User logged in',
      timestamp: '3 days ago',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString('en-GB'),
      ip: '122.152.51.53',
      type: 'login',
      icon: 'User'
    }
  ];

  // Get recent activities (simulated from various data sources)
  const {
    data: activities = mockActivities,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      try {
        console.log('📊 Generating recent activities from various sources...');
        
        // In a real implementation, you might fetch from multiple endpoints
        // and combine them into activity logs
        const activities = [];
        
        // Add login activity (current session)
        activities.push({
          id: 'login-' + Date.now(),
          user: 'Super Admin',
          action: 'Logged in: User logged in',
          timestamp: '30 minutes ago',
          date: new Date().toLocaleString('en-GB'),
          ip: '122.152.51.53',
          type: 'login',
          icon: 'User'
        });

        // Try to fetch recent contacts for activity
        try {
          const contactsRes = await axios.get('/api/contacts?limit=2');
          const recentContacts = contactsRes.data.contacts || [];
          
          recentContacts.forEach((contact, index) => {
            activities.push({
              id: 'contact-' + contact._id,
              user: 'System',
              action: `New contact received from ${contact.name}`,
              timestamp: getTimeAgo(contact.createdAt),
              date: new Date(contact.createdAt).toLocaleString('en-GB'),
              ip: 'N/A',
              type: 'action',
              icon: 'FileText'
            });
          });
        } catch (err) {
          console.log('Could not fetch contacts for activities');
        }

        // Try to fetch recent blogs for activity
        try {
          const blogsRes = await axios.get('/blogs?limit=1');
          const recentBlogs = blogsRes.data.blogs || blogsRes.data || [];
          
          recentBlogs.forEach((blog) => {
            activities.push({
              id: 'blog-' + blog._id,
              user: 'Super Admin',
              action: `Published blog post: ${blog.title}`,
              timestamp: getTimeAgo(blog.createdAt),
              date: new Date(blog.createdAt).toLocaleString('en-GB'),
              ip: '122.152.51.53',
              type: 'action',
              icon: 'FileText'
            });
          });
        } catch (err) {
          console.log('Could not fetch blogs for activities');
        }

        // Add some mock activities if we don't have enough real ones
        while (activities.length < 6) {
          const mockActivity = mockActivities[activities.length % mockActivities.length];
          activities.push({
            ...mockActivity,
            id: 'mock-' + activities.length
          });
        }

        // Sort by most recent first and limit to 6
        const sortedActivities = activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        console.log('✅ Recent activities generated:', sortedActivities.length);
        return sortedActivities;

      } catch (error) {
        console.error('❌ Error generating activities:', error);
        console.log('🔄 Using mock data for activities');
        return mockActivities;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now - past;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Clear activities (mock function)
  const clearActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would clear activities from the backend
      console.log('🗑️ Clearing activities...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refetch to get updated data
      refetchActivities();
      
      return { success: true, message: 'Activities cleared successfully' };
    } catch (err) {
      setError(err.message || 'Failed to clear activities');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => setError(null);

  return {
    // Data
    activities,
    loading: loading || activitiesLoading,
    error: error || activitiesError?.message,
    
    // Functions
    clearActivities,
    refetchActivities,
    clearError
  };
};

export default useActivitiesAPI;