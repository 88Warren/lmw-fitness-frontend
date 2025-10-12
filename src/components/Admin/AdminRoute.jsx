import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminRoute = () => {
  const { user, isLoggedIn, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-customGray">
        <p className="text-xl font-titillium text-customWhite">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;