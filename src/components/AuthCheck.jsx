import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const AuthCheck = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        navigate('/admin');
        return;
      }

      try {
        // Basic token validation (check if it's not expired)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          console.log('❌ Token expired, redirecting to login');
          localStorage.removeItem('admin_token');
          navigate('/admin');
          return;
        }

        console.log('✅ Token is valid');
        setIsAuthenticated(true);
      } catch (error) {
        console.log('❌ Invalid token, redirecting to login');
        localStorage.removeItem('admin_token');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
};

export default AuthCheck;