import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAxios from './useAxios';

const useLogin = () => {
  const axios = useAxios();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      // For development/testing - replace with actual API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real logic
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        return { 
          token: 'mock-jwt-token', 
          user: { id: 1, username: credentials.username, role: 'admin' } 
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      // Uncomment this when you have a real backend:
      // const response = await axios.post('/api/auth/login', credentials);
      // return response.data;
    },
    onSuccess: (data) => {
      // Store auth token if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
      // You can add toast notifications here
    }
  });
};

export default useLogin;