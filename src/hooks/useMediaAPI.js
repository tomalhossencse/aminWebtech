import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';

const useMediaAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all media files with pagination and filters
  const {
    data: mediaData,
    isLoading: mediaLoading,
    error: mediaError,
    refetch: refetchMedia
  } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      console.log('🔍 Fetching media from API...');
      const response = await axios.get('/api/media');
      console.log('✅ Media API response:', response.data);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Upload media file mutation
  const uploadMediaMutation = useMutation({
    mutationFn: async (mediaData) => {
      setLoading(true);
      setError(null);
      
      console.log('📤 Uploading media:', mediaData);
      const response = await axios.post('/api/media', mediaData);
      console.log('✅ Media uploaded:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error uploading media:', error);
      setError(error.response?.data?.error || error.message || 'Failed to upload media file');
      setLoading(false);
    }
  });

  // Update media file mutation
  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/media/${id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error updating media:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update media file');
      setLoading(false);
    }
  });

  // Delete single media file mutation
  const deleteMediaMutation = useMutation({
    mutationFn: async (id) => {
      setLoading(true);
      setError(null);
      
      await axios.delete(`/api/media/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error deleting media:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete media file');
      setLoading(false);
    }
  });

  // Delete multiple media files mutation
  const deleteMultipleMediaMutation = useMutation({
    mutationFn: async (ids) => {
      setLoading(true);
      setError(null);
      
      console.log('🗑️ Deleting multiple media files:', ids);
      const response = await axios.delete('/api/media', { data: { ids } });
      console.log('✅ Multiple media files deleted:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error deleting multiple media files:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete media files');
      setLoading(false);
    }
  });

  // Helper functions
  const uploadMedia = async (mediaData) => {
    return uploadMediaMutation.mutateAsync(mediaData);
  };

  const updateMedia = async (id, updateData) => {
    return updateMediaMutation.mutateAsync({ id, ...updateData });
  };

  const deleteMedia = async (id) => {
    return deleteMediaMutation.mutateAsync(id);
  };

  const deleteMultipleMedia = async (ids) => {
    return deleteMultipleMediaMutation.mutateAsync(ids);
  };

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get file type from mime type
  const getFileTypeFromMime = (mimeType) => {
    if (!mimeType) return 'Document';
    
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    return 'Document';
  };

  // Clear error function
  const clearError = () => setError(null);

  return {
    // Data
    media: mediaData?.media || [],
    stats: mediaData?.stats || {
      total: 0,
      images: 0,
      documents: 0,
      videos: 0,
      audio: 0,
      totalSize: 0
    },
    total: mediaData?.total || 0,
    page: mediaData?.page || 1,
    limit: mediaData?.limit || 20,
    totalPages: mediaData?.totalPages || 1,
    loading: loading || mediaLoading ||
             uploadMediaMutation.isPending || 
             updateMediaMutation.isPending || 
             deleteMediaMutation.isPending ||
             deleteMultipleMediaMutation.isPending,
    error: error || mediaError?.message,
    
    // Functions
    uploadMedia,
    updateMedia,
    deleteMedia,
    deleteMultipleMedia,
    refetchMedia,
    clearError,
    formatFileSize,
    getFileTypeFromMime,
    
    // Mutation states
    uploadMediaMutation,
    updateMediaMutation,
    deleteMediaMutation,
    deleteMultipleMediaMutation
  };
};

export default useMediaAPI;