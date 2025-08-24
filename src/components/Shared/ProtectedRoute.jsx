// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth(); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;