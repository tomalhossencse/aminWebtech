import { useState, useCallback } from 'react';
import useAxios from './useAxios';

const useTeamAPI = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all team members with pagination and filters
  const getTeamMembers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.active && params.active !== 'all') queryParams.append('active', params.active);
      
      const response = await axios.get(`/team-members?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch team members');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Get single team member by ID
  const getTeamMember = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/team-members/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Create new team member
  const createTeamMember = useCallback(async (memberData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate initials from name
      const initials = memberData.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
      
      const memberPayload = {
        ...memberData,
        initials,
        displayOrder: memberData.displayOrder || 0
      };
      
      const response = await axios.post('/team-members', memberPayload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Update team member
  const updateTeamMember = useCallback(async (id, memberData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate initials from name if name is updated
      if (memberData.name) {
        const initials = memberData.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .join('')
          .substring(0, 2);
        memberData.initials = initials;
      }
      
      const response = await axios.put(`/team-members/${id}`, memberData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Delete team member
  const deleteTeamMember = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`/team-members/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  return {
    loading,
    error,
    getTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
  };
};

export default useTeamAPI;