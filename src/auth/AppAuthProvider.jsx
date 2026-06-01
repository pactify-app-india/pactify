import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AUTH_STATUS, resolveAuthStatus } from './auth-state';

const AppAuthContext = createContext(null);

export function AppAuthProvider({ children }) {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isGuest, setIsGuest] = useState(false);

  const roleClaimNamespace = import.meta.env.VITE_ROLE_CLAIM_NAMESPACE;

  const status = resolveAuthStatus({
    isLoading,
    isAuthenticated,
    user,
    roleClaimNamespace,
    isGuest,
  });

  const role =
    user?.[`${roleClaimNamespace}/role`] ||
    user?.app_metadata?.role ||
    null;

  const enterGuestMode = () => setIsGuest(true);
  const exitGuestMode = () => setIsGuest(false);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      user,
      role,
      status,
      isGuest,
      enterGuestMode,
      exitGuestMode,
      loginWithRedirect,
      logout,
    }),
    [isLoading, isAuthenticated, user, role, status, isGuest, loginWithRedirect, logout]
  );

  return <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>;
}

export function useAppAuth() {
  const ctx = useContext(AppAuthContext);
  if (!ctx) throw new Error('useAppAuth must be used within AppAuthProvider');
  return ctx;
}

export { AUTH_STATUS };
