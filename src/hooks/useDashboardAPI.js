import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';

const useDashboardAPI = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for when server is not available
  const mockDashboardData = {
    stats: {
      services: { total: 5, change: '+12%', changeType: 'increase', progress: 85 },
      projects: { total: 2, change: '+8%', changeType: 'increase', progress: 70 },
      blogs: { total: 1, change: 'New', changeType: 'new', progress: 30 },
      teamMembers: { total: 4, change: '+1', changeType: 'increase', progress: 90 },
      testimonials: { total: 1, change: 'Stable', changeType: 'stable', progress: 60 },
      contacts: { total: 3, new: 1, change: '+3', changeType: 'increase', progress: 45 }
    },
    contentData: [
      { name: 'Services', value: 5, color: '#3b82f6' },
      { name: 'Projects', value: 2, color: '#10b981' },
      { name: 'Blog Posts', value: 1, color: '#f59e0b' },
      { name: 'Team', value: 4, color: '#8b5cf6' },
      { name: 'Testimonials', value: 1, color: '#ef4444' },
      { name: 'Media', value: 4, color: '#6366f1' }
    ],
    pieData: [
      { name: 'Active', value: 90, color: '#10b981' },
      { name: 'Inactive', value: 10, color: '#ef4444' }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'contact',
        title: 'New contact message',
        description: 'Akash Rahman sent a new message',
        time: '2 hours ago',
        icon: 'Mail'
      },
      {
        id: 2,
        type: 'project',
        title: 'Project updated',
        description: 'Portfolio website project was updated',
        time: '4 hours ago',
        icon: 'GitBranch'
      },
      {
        id: 3,
        type: 'blog',
        title: 'New blog post',
        description: 'Published "Getting Started with React"',
        time: '1 day ago',
        icon: 'Rss'
      }
    ]
  };

  // Get dashboard statistics
  const {
    data: dashboardData = mockDashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        console.log('📊 Fetching dashboard statistics...');
        
        // Fetch data from multiple endpoints
        const [
          servicesRes,
          projectsRes,
          blogsRes,
          teamRes,
          testimonialsRes,
          contactsRes,
          mediaRes
        ] = await Promise.allSettled([
          axios.get('/services'),
          axios.get('/projects'),
          axios.get('/blogs'),
          axios.get('/team-members'),
          axios.get('/api/testimonials'),
          axios.get('/api/contacts'),
          axios.get('/api/media')
        ]);

        // Extract data from successful responses
        const services = servicesRes.status === 'fulfilled' ? servicesRes.value.data : [];
        const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.data.projects || projectsRes.value.data : [];
        const blogs = blogsRes.status === 'fulfilled' ? blogsRes.value.data.blogs || blogsRes.value.data : [];
        const teamMembers = teamRes.status === 'fulfilled' ? teamRes.value.data.teamMembers || teamRes.value.data : [];
        const testimonials = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data.testimonials || testimonialsRes.value.data : [];
        const contacts = contactsRes.status === 'fulfilled' ? contactsRes.value.data.contacts || contactsRes.value.data : [];
        const media = mediaRes.status === 'fulfilled' ? mediaRes.value.data.media || mediaRes.value.data : [];

        // Calculate statistics
        const stats = {
          services: {
            total: Array.isArray(services) ? services.length : 0,
            change: '+12%',
            changeType: 'increase',
            progress: 85
          },
          projects: {
            total: Array.isArray(projects) ? projects.length : 0,
            change: '+8%',
            changeType: 'increase',
            progress: 70
          },
          blogs: {
            total: Array.isArray(blogs) ? blogs.length : 0,
            change: blogs.length > 0 ? 'New' : 'None',
            changeType: blogs.length > 0 ? 'new' : 'stable',
            progress: blogs.length > 0 ? 30 : 0
          },
          teamMembers: {
            total: Array.isArray(teamMembers) ? teamMembers.length : 0,
            change: '+1',
            changeType: 'increase',
            progress: 90
          },
          testimonials: {
            total: Array.isArray(testimonials) ? testimonials.length : 0,
            change: 'Stable',
            changeType: 'stable',
            progress: 60
          },
          contacts: {
            total: Array.isArray(contacts) ? contacts.length : 0,
            new: Array.isArray(contacts) ? contacts.filter(c => c.status === 'new').length : 0,
            change: '+3',
            changeType: 'increase',
            progress: 45
          }
        };

        // Create content data for charts
        const contentData = [
          { name: 'Services', value: stats.services.total, color: '#3b82f6' },
          { name: 'Projects', value: stats.projects.total, color: '#10b981' },
          { name: 'Blog Posts', value: stats.blogs.total, color: '#f59e0b' },
          { name: 'Team', value: stats.teamMembers.total, color: '#8b5cf6' },
          { name: 'Testimonials', value: stats.testimonials.total, color: '#ef4444' },
          { name: 'Media', value: Array.isArray(media) ? media.length : 0, color: '#6366f1' }
        ];

        // Calculate active/inactive services for pie chart
        const activeServices = Array.isArray(services) ? services.filter(s => s.active !== false).length : 0;
        const totalServices = Array.isArray(services) ? services.length : 0;
        const inactiveServices = totalServices - activeServices;
        
        const pieData = [
          { 
            name: 'Active', 
            value: totalServices > 0 ? Math.round((activeServices / totalServices) * 100) : 90, 
            color: '#10b981' 
          },
          { 
            name: 'Inactive', 
            value: totalServices > 0 ? Math.round((inactiveServices / totalServices) * 100) : 10, 
            color: '#ef4444' 
          }
        ];

        // Generate recent activities
        const recentActivities = [];
        
        // Add recent contacts
        if (Array.isArray(contacts)) {
          contacts.slice(0, 2).forEach(contact => {
            recentActivities.push({
              id: `contact-${contact._id}`,
              type: 'contact',
              title: 'New contact message',
              description: `${contact.name} sent a new message`,
              time: getTimeAgo(contact.createdAt),
              icon: 'Mail'
            });
          });
        }

        // Add recent projects
        if (Array.isArray(projects)) {
          projects.slice(0, 1).forEach(project => {
            recentActivities.push({
              id: `project-${project._id}`,
              type: 'project',
              title: 'Project updated',
              description: `${project.title} project was updated`,
              time: getTimeAgo(project.updatedAt || project.createdAt),
              icon: 'GitBranch'
            });
          });
        }

        // Add recent blogs
        if (Array.isArray(blogs)) {
          blogs.slice(0, 1).forEach(blog => {
            recentActivities.push({
              id: `blog-${blog._id}`,
              type: 'blog',
              title: 'New blog post',
              description: `Published "${blog.title}"`,
              time: getTimeAgo(blog.createdAt),
              icon: 'Rss'
            });
          });
        }

        console.log('✅ Dashboard statistics compiled:', { stats, contentData, pieData });

        return {
          stats,
          contentData,
          pieData,
          recentActivities: recentActivities.slice(0, 5) // Limit to 5 activities
        };

      } catch (error) {
        console.error('❌ Error fetching dashboard statistics:', error);
        console.log('🔄 Using mock data for dashboard');
        return mockDashboardData;
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

  // Get individual data sets
  const getServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/services');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch services');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  const getProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/projects');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch projects');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Clear error function
  const clearError = () => setError(null);

  return {
    // Dashboard data
    dashboardData,
    loading: loading || dashboardLoading,
    error: error || dashboardError?.message,
    
    // Functions
    getServices,
    getProjects,
    refetchDashboard,
    clearError
  };
};

export default useDashboardAPI;