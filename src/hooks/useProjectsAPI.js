import { useState, useCallback } from 'react';
import useAxios from './useAxios';

const useProjectsAPI = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all projects with pagination and filters
  const getProjects = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.category && params.category !== 'All Projects') queryParams.append('category', params.category);
      if (params.status && params.status !== 'All Status') queryParams.append('status', params.status);
      
      const response = await axios.get(`/projects?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch projects');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Get single project by ID
  const getProject = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/projects/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Create new project
  const createProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/projects', projectData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Update project
  const updateProject = useCallback(async (id, projectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Delete project
  const deleteProject = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`/projects/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  return {
    loading,
    error,
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
  };
};

export default useProjectsAPI;