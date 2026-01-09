// src/hooks/useLogout.js
const useLogout = () => {
  const handleLogout = () => {
    // Clear all authentication tokens
    localStorage.removeItem("admin_token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    
    // Force a clean state by redirecting to login
    window.location.href = "/admin";
  };

  return { handleLogout };
};

export default useLogout;