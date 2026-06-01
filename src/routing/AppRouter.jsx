import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppAuth, AUTH_STATUS } from '../auth/AppAuthProvider';
import CallbackPage from '../pages/CallbackPage';
import LoginPage from '../pages/LoginPage';
import RoleSelectionPage from '../pages/RoleSelectionPage';
import FreelancerDashboard from '../pages/FreelancerDashboard';
import ClientDashboard from '../pages/ClientDashboard';
import GuestHomePage from '../pages/GuestHomePage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import RoleGate from './RoleGate';

function DashboardIndex() {
  const { status } = useAppAuth();

  if (status === AUTH_STATUS.AUTHENTICATED_FREELANCER) {
    return <Navigate to="/app/freelancer" replace />;
  }

  if (status === AUTH_STATUS.AUTHENTICATED_CLIENT) {
    return <Navigate to="/app/client" replace />;
  }

  if (status === AUTH_STATUS.AUTHENTICATED_NO_ROLE) {
    return <Navigate to="/onboarding/pending" replace />;
  }

  if (status === AUTH_STATUS.GUEST) {
    return <Navigate to="/guest" replace />;
  }

  return <Navigate to="/login" replace />;
}

function PendingOnboardingPage() {
  return <div>Completing your setup...</div>;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/onboarding/role-selection" element={<RoleSelectionPage />} />
      <Route path="/onboarding/pending" element={<PendingOnboardingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="/guest" element={<RoleGate allowGuest={true} />}>
        <Route index element={<GuestHomePage />} />
      </Route>

      <Route path="/app" element={<RoleGate />}>
        <Route index element={<DashboardIndex />} />
      </Route>

      <Route path="/app" element={<RoleGate allowedRoles={['freelancer']} />}>
        <Route path="freelancer" element={<FreelancerDashboard />} />
      </Route>

      <Route path="/app" element={<RoleGate allowedRoles={['client']} />}>
        <Route path="client" element={<ClientDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
