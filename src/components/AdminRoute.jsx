// src/components/AdminRoute.jsx
import { Navigate, useLocation } from "react-router";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("admin_token");
  const location = useLocation();

  useEffect(() => {
    const validateToken = () => {
      if (!token) {
        console.log('❌ No token found');
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        // Basic token validation (check if it's not expired)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          console.log('❌ Token expired');
          localStorage.removeItem('admin_token');
          setIsAuthenticated(false);
        } else {
          console.log('✅ Token is valid');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('❌ Invalid token format');
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Validating authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
