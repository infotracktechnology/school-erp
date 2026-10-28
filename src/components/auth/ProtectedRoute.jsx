import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useErp } from '../../context/ErpContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, isAuthenticated, userRole } = useErp();
  const location = useLocation();

  // If user is not logged in, redirect them to /login and preserve destination
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't have it, redirect appropriately
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === 'student') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
