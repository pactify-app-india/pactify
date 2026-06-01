import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppAuth, AUTH_STATUS } from '../auth/AppAuthProvider';

export default function RoleGate({ allowedRoles = [], allowGuest = false }) {
  const { status, role } = useAppAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.LOADING) {
    return <div>Loading session...</div>;
  }

  if (status === AUTH_STATUS.GUEST && allowGuest) {
    return <Outlet />;
  }

  if (status === AUTH_STATUS.ANONYMOUS) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  }

  if (status === AUTH_STATUS.GUEST && !allowGuest) {
    return <Navigate to="/guest" replace />;
  }

  if (status === AUTH_STATUS.AUTHENTICATED_NO_ROLE) {
    return <Navigate to="/onboarding/pending" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
