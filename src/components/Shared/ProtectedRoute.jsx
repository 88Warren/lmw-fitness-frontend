// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { isTokenExpired } from '../../utils/tokenUtils';

const ProtectedRoute = () => {
  const { isLoggedIn, loading, token, clearAuthData } = useAuth(); 

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if token is expired
  if (token && isTokenExpired(token)) {
    clearAuthData();
    return <Navigate to="/login" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;