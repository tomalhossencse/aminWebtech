// src/components/AdminRoute.jsx
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  return children;
};
export default AdminRoute;
