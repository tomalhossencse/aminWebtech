import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';

const useContactsAPI = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all contacts with pagination and filters
  const {
    data: contactsData,
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      console.log('🔍 Fetching contacts from API...');
      const response = await axios.get('/api/contacts');
      console.log('✅ Contacts API response:', response.data);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create contact mutation (from contact form)
  const createContactMutation = useMutation({
    mutationFn: async (contactData) => {
      setLoading(true);
      setError(null);
      
      console.log('📝 Creating contact:', contactData);
      const response = await axios.post('/api/contacts', contactData);
      console.log('✅ Contact created:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error creating contact:', error);
      setError(error.response?.data?.error || error.message || 'Failed to submit contact form');
      setLoading(false);
    }
  });

  // Update contact status mutation
  const updateContactStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`/api/contacts/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error updating contact status:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update contact status');
      setLoading(false);
    }
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id) => {
      setLoading(true);
      setError(null);
      
      await axios.delete(`/api/contacts/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error deleting contact:', error);
      setError(error.response?.data?.error || error.message || 'Failed to delete contact');
      setLoading(false);
    }
  });

  // Reply to contact mutation
  const replyToContactMutation = useMutation({
    mutationFn: async ({ id, message, trackingId }) => {
      setLoading(true);
      setError(null);
      
      console.log('📧 Sending reply to contact:', { id, message, trackingId });
      const response = await axios.post(`/api/contacts/${id}/reply`, { 
        message, 
        trackingId 
      });
      console.log('✅ Reply sent:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setLoading(false);
    },
    onError: (error) => {
      console.error('❌ Error sending reply:', error);
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
    contacts: contactsData?.contacts || [],
    stats: contactsData?.stats || {
      total: 0,
      new: 0,
      read: 0,
      replied: 0,
      spam: 0
    },
    total: contactsData?.total || 0,
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