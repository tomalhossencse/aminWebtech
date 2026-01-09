import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';

const useMediaAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for when server is not available
  const mockData = {
    media: [
      {
        _id: 'mock-1',
        name: 'WhatsApp Image 2026-01-04 at 5.45.01 PM',
        originalName: 'WhatsApp Image 2026-01-04 at 5.45.01 PM.jpg',
        type: 'Image',
        size: 102400, // 0.1 MB in bytes
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW9tsizm1WJNY4dIShZRcauThCvfor9cD_oBasenVnrsutpWfccL_d6tVxKF-MUkXcIAI6Gz-pandOvSrJJayMeZjB-_6DoTocXNtRIv7EIBNR4P-pj_umlOYv_Uq7xJQNf-MStZF06rFHkp_eCFbgqkrejeudmh2AtzMXE8crYywGei5rkXUZGATI9vxvjnjDPhW761ATER25HiRGe6EZXSbn2n80DHex6T2h7IVNJsxFvqHuJ77JPqTgMdMRa3HDtvO_eIsDMBM',
        alt: 'Abstract blue purple wave background',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        createdAt: new Date('2024-12-29'),
        updatedAt: new Date('2024-12-29')
      },
      {
        _id: 'mock-2',
        name: 'WhatsApp Image 2026-01-04 at 5.45.02 PM',
        originalName: 'WhatsApp Image 2026-01-04 at 5.45.02 PM.jpg',
        type: 'Image',
        size: 102400,
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEl2hZbGarZrondXL7JrQMBs3DNXSsuVaqvetOvYIQ6EEaIezsZyucGdj5c6mhAgV64z0qO2uzH50Po4Of6Iu-t0865yQFIBjWXkz1Hxi9B0UX1HyZae5-2AcFVW0kXq2YEyKSp1-mDr1Dj6bD8PGHSUzLcnm2VTuqOiq0SAOAKYpxwmXR0PGbKDrNKl9-s9WikdqKt7UYh19gZ7rsm-iLYv8UArvBT1ghXssdBeLj35s76K5G0pFBs85jIvEZb6x01YqRw3-LgQM',
        alt: 'Office desk with computer showing development',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        createdAt: new Date('2024-12-28'),
        updatedAt: new Date('2024-12-28')
      },
      {
        _id: 'mock-3',
        name: 'WhatsApp Image 2026-01-04 at 5.45.03 PM',
        originalName: 'WhatsApp Image 2026-01-04 at 5.45.03 PM.jpg',
        type: 'Image',
        size: 102400,
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOVyCn3d7BOiUyVECiZlUoGGeY_DF92x87ZSqcmTVp7Wk-JvcifeRdvhHpMOwZSX-qVYInKZ1sYQfsiWh3pF8fzcwDyKzgBvz6mkbpfE98_PEtat9IK_iLwoqoVmx3yqZCkYUswJJWTEwlOc_MffEh05Fqg5noeHDH0eV6TBMAZABytVxUSCifs360MLwTKXJKhjgL-UEu8Z29JB_rXWJw-cyJGkEKk_Bat22N_mv6EONxkYorX8S8z0nNkwZ0Zo5sqI7ZqebRvxU',
        alt: 'Yellow web hosting promotional graphic',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        createdAt: new Date('2024-12-27'),
        updatedAt: new Date('2024-12-27')
      },
      {
        _id: 'mock-4',
        name: 'Project Documentation.pdf',
        originalName: 'Project Documentation.pdf',
        type: 'Document',
        size: 2411724, // 2.3 MB in bytes
        url: null,
        alt: 'PDF Document',
        mimeType: 'application/pdf',
        width: null,
        height: null,
        createdAt: new Date('2024-12-26'),
        updatedAt: new Date('2024-12-26')
      },
      {
        _id: 'mock-5',
        name: 'Demo Video.mp4',
        originalName: 'Demo Video.mp4',
        type: 'Video',
        size: 16460390, // 15.7 MB in bytes
        url: null,
        alt: 'Video File',
        mimeType: 'video/mp4',
        width: 1920,
        height: 1080,
        createdAt: new Date('2024-12-25'),
        updatedAt: new Date('2024-12-25')
      }
    ],
    stats: {
      total: 5,
      images: 3,
      documents: 1,
      videos: 1,
      audio: 0,
      totalSize: 21179238 // Total size in bytes
    },
    total: 5,
    page: 1,
    limit: 20,
    totalPages: 1
  };

  // Get all media files with pagination and filters
  const {
    data: mediaData = mockData,
    isLoading: mediaLoading,
    error: mediaError,
    refetch: refetchMedia
  } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching media from API...');
        const response = await axios.get('/api/media');
        console.log('✅ Media API response:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching media:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Return mock data if server is not available
        console.log('🔄 Using mock data for media');
        return mockData;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  // Upload media file mutation
  const uploadMediaMutation = useMutation({
    mutationFn: async (mediaData) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📤 Uploading media:', mediaData);
        const response = await axios.post('/api/media', mediaData);
        console.log('✅ Media uploaded:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error uploading media:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Simulate success for development if server is not available
        console.log('🔄 Simulating media upload');
        return {
          _id: 'mock-' + Date.now(),
          ...mediaData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to upload media file');
      setLoading(false);
    }
  });

  // Update media file mutation
  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.put(`/api/media/${id}`, updateData);
        return response.data;
      } catch (error) {
        console.error('Error updating media:', error);
        
        // Simulate success for development
        console.log('🔄 Simulating media update');
        return { _id: id, ...updateData };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to update media file');
      setLoading(false);
    }
  });

  // Delete single media file mutation
  const deleteMediaMutation = useMutation({
    mutationFn: async (id) => {
      setLoading(true);
      setError(null);
      
      try {
        await axios.delete(`/api/media/${id}`);
        return id;
      } catch (error) {
        console.error('Error deleting media:', error);
        
        // Simulate success for development
        console.log('🔄 Simulating media deletion');
        return id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to delete media file');
      setLoading(false);
    }
  });

  // Delete multiple media files mutation
  const deleteMultipleMediaMutation = useMutation({
    mutationFn: async (ids) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🗑️ Deleting multiple media files:', ids);
        const response = await axios.delete('/api/media', { data: { ids } });
        console.log('✅ Multiple media files deleted:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error deleting multiple media files:', error);
        
        // Simulate success for development
        console.log('🔄 Simulating multiple media deletion');
        return { deletedCount: ids.length };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
      setLoading(false);
    },
    onError: (error) => {
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
    media: mediaData.media || [],
    stats: mediaData.stats || {},
    total: mediaData.total || 0,
    page: mediaData.page || 1,
    limit: mediaData.limit || 20,
    totalPages: mediaData.totalPages || 1,
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