import { useState, useCallback } from 'react';
import useAxios from './useAxios';

const useBlogAPI = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all blogs with pagination and filters
  const getBlogs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'All Status') queryParams.append('status', params.status);
      
      const response = await axios.get(`/blogs?${queryParams.toString()}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch blogs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Get single blog by ID
  const getBlog = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/blogs/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch blog');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Create new blog
  const createBlog = useCallback(async (blogData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add author and created date
      const blogPayload = {
        ...blogData,
        author: 'Super Admin', // You can get this from auth context
        created: new Date().toLocaleDateString('en-GB')
      };
      
      const response = await axios.post('/blogs', blogPayload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create blog');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Update blog
  const updateBlog = useCallback(async (id, blogData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update blog');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Delete blog
  const deleteBlog = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`/blogs/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete blog');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Increment blog views
  const incrementViews = useCallback(async (id) => {
    try {
      const response = await axios.put(`/blogs/${id}/views`);
      return response.data;
    } catch (err) {
      console.error('Failed to increment views:', err);
      // Don't throw error for view tracking failures
    }
  }, [axios]);

  return {
    loading,
    error,
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    incrementViews
  };
};

export default useBlogAPI;