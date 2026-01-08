import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';

// Hook for analytics overview data
export const useAnalyticsOverview = (timeRange = '7d') => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ['analytics', 'overview', timeRange],
    queryFn: async () => {
      console.log('🔍 Fetching analytics overview for timeRange:', timeRange);
      const response = await axios.get(`/analytics/overview?timeRange=${timeRange}`);
      console.log('📊 Analytics overview response:', response.data);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    onError: (error) => {
      console.error('❌ Analytics overview error:', error.response?.data || error.message);
    }
  });
};

// Hook for visitor distribution data
export const useVisitorDistribution = (timeRange = '7d') => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ['analytics', 'visitor-distribution', timeRange],
    queryFn: async () => {
      console.log('🔍 Fetching visitor distribution for timeRange:', timeRange);
      const response = await axios.get(`/analytics/visitor-distribution?timeRange=${timeRange}`);
      console.log('🌍 Visitor distribution response:', response.data);
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 50000,
    onError: (error) => {
      console.error('❌ Visitor distribution error:', error.response?.data || error.message);
    }
  });
};

// Hook for recent visitors data
export const useRecentVisitors = (limit = 10) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ['analytics', 'recent-visitors', limit],
    queryFn: async () => {
      console.log('🔍 Fetching recent visitors with limit:', limit);
      const response = await axios.get(`/analytics/recent-visitors?limit=${limit}`);
      console.log('👥 Recent visitors response:', response.data);
      return response.data;
    },
    refetchInterval: 15000, // Refetch every 15 seconds
    staleTime: 10000,
    onError: (error) => {
      console.error('❌ Recent visitors error:', error.response?.data || error.message);
    }
  });
};

// Hook for top pages data
export const useTopPages = (timeRange = '7d', limit = 10) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ['analytics', 'top-pages', timeRange, limit],
    queryFn: async () => {
      console.log('🔍 Fetching top pages for timeRange:', timeRange, 'limit:', limit);
      const response = await axios.get(`/analytics/top-pages?timeRange=${timeRange}&limit=${limit}`);
      console.log('📄 Top pages response:', response.data);
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 50000,
    onError: (error) => {
      console.error('❌ Top pages error:', error.response?.data || error.message);
    }
  });
};