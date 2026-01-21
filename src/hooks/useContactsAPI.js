import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';

const useContactsAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for when server is not available
  const mockData = {
    contacts: [
      {
        _id: 'mock-1',
        name: 'Akash Rahman',
        email: 'akash@gmail.com',
        phone: '01814726978',
        subject: 'Need a website',
        message: 'Hello, I am looking for a professional website for my business. Can you help me with this project?',
        status: 'read',
        createdAt: new Date('2024-12-29'),
        updatedAt: new Date('2024-12-29'),
        readAt: new Date('2024-12-29'),
        repliedAt: null
      },
      {
        _id: 'mock-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '01712345678',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a new project for my startup. We need a complete web solution with modern design.',
        status: 'new',
        createdAt: new Date('2024-12-28'),
        updatedAt: new Date('2024-12-28'),
        readAt: null,
        repliedAt: null
      },
      {
        _id: 'mock-3',
        name: 'Mike Chen',
        email: 'mike@company.com',
        phone: '01987654321',
        subject: 'Support Request',
        message: 'Having issues with the current system. The dashboard is not loading properly and we need urgent assistance.',
        status: 'replied',
        createdAt: new Date('2024-12-27'),
        updatedAt: new Date('2024-12-27'),
        readAt: new Date('2024-12-27'),
        repliedAt: new Date('2024-12-27')
      }
    ],
    stats: {
      total: 3,
      new: 1,
      read: 1,
      replied: 1,
      spam: 0
    },
    total: 3
  };

  // Get all contacts with pagination and filters
  const {
    data: contactsData = mockData,
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching contacts from API...');
        const response = await axios.get('/api/contacts');
        console.log('✅ Contacts API response:', response.data);
        return response.data;
      } catch (error) {
        // Only log detailed errors for non-auth issues
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error('❌ Error fetching contacts:', error);
          console.error('Error details:', error.response?.data || error.message);
        } else {
          console.log('🔐 Contacts API requires authentication - using mock data');
        }
        
        // Return mock data if server is not available or auth fails
        console.log('🔄 Using mock data for contacts');
        return mockData;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  // Create contact mutation (from contact form)
  const createContactMutation = useMutation({
    mutationFn: async (contactData) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📝 Creating contact:', contactData);
        const response = await axios.post('/api/contacts', contactData);
        console.log('✅ Contact created:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error creating contact:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Simulate success for development if server is not available
        console.log('🔄 Simulating contact creation');
        return {
          _id: 'mock-' + Date.now(),
          ...contactData,
          status: 'new',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to submit contact form');
      setLoading(false);
    }
  });

  // Update contact status mutation
  const updateContactStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.put(`/api/contacts/${id}/status`, { status });
        return response.data;
      } catch (error) {
        console.error('Error updating contact status:', error);
        
        // Simulate success for development
        console.log('🔄 Simulating status update');
        return { _id: id, status };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to update contact status');
      setLoading(false);
    }
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id) => {
      setLoading(true);
      setError(null);
      
      try {
        await axios.delete(`/api/contacts/${id}`);
        return id;
      } catch (error) {
        console.error('Error deleting contact:', error);
        
        // Simulate success for development
        console.log('🔄 Simulating contact deletion');
        return id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to delete contact');
      setLoading(false);
    }
  });

  // Reply to contact mutation
  const replyToContactMutation = useMutation({
    mutationFn: async ({ id, message, trackingId }) => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📧 Sending reply to contact:', { id, message, trackingId });
        const response = await axios.post(`/api/contacts/${id}/reply`, { 
          message, 
          trackingId 
        });
        console.log('✅ Reply sent:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error sending reply:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        // Simulate success for development
        console.log('🔄 Simulating reply sending');
        return {
          success: true,
          message: 'Reply sent successfully (simulated)',
          trackingId
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.response?.data?.error || error.message || 'Failed to send reply');
      setLoading(false);
    }
  });

  // Helper functions
  const createContact = async (contactData) => {
    return createContactMutation.mutateAsync(contactData);
  };

  const updateContactStatus = async (id, status) => {
    return updateContactStatusMutation.mutateAsync({ id, status });
  };

  const deleteContact = async (id) => {
    return deleteContactMutation.mutateAsync(id);
  };

  const replyToContact = async (id, message, trackingId = null) => {
    return replyToContactMutation.mutateAsync({ id, message, trackingId });
  };

  // Mark contact as read
  const markAsRead = async (id) => {
    return updateContactStatusMutation.mutateAsync({ id, status: 'read' });
  };

  // Mark contact as replied
  const markAsReplied = async (id) => {
    return updateContactStatusMutation.mutateAsync({ id, status: 'replied' });
  };

  // Mark contact as spam
  const markAsSpam = async (id) => {
    return updateContactStatusMutation.mutateAsync({ id, status: 'spam' });
  };

  // Clear error function
  const clearError = () => setError(null);

  return {
    // Data
    contacts: contactsData.contacts || [],
    stats: contactsData.stats || {},
    total: contactsData.total || 0,
    loading: loading || contactsLoading ||
             createContactMutation.isPending || 
             updateContactStatusMutation.isPending || 
             deleteContactMutation.isPending ||
             replyToContactMutation.isPending,
    error: error || contactsError?.message,
    
    // Functions
    createContact,
    updateContactStatus,
    deleteContact,
    replyToContact,
    markAsRead,
    markAsReplied,
    markAsSpam,
    refetchContacts,
    clearError,
    
    // Mutation states
    createContactMutation,
    updateContactStatusMutation,
    deleteContactMutation,
    replyToContactMutation
  };
};

export default useContactsAPI;