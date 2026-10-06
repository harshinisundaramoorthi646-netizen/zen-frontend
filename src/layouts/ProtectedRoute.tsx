import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePlatformStore } from '../store/usePlatformStore';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { role } = usePlatformStore();
  const location = useLocation();

  // Admin has access to all routes
  if (role === 'Admin') {
    return <>{children}</>;
  }

  // Check if user's role is permitted
  if (!allowedRoles.includes(role)) {
    // Redirect unauthorized user to their primary team dashboard
    let fallbackPath = '/login';
    if (role === 'Team A') fallbackPath = '/team-a';
    else if (role === 'Team B') fallbackPath = '/team-b';
    else if (role === 'Team C') fallbackPath = '/team-c';

    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
