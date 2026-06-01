export const AUTH_STATUS = {
  LOADING: 'LOADING',
  ANONYMOUS: 'ANONYMOUS',
  AUTHENTICATED_NO_ROLE: 'AUTHENTICATED_NO_ROLE',
  AUTHENTICATED_FREELANCER: 'AUTHENTICATED_FREELANCER',
  AUTHENTICATED_CLIENT: 'AUTHENTICATED_CLIENT',
  GUEST: 'GUEST',
};

export function resolveAuthStatus({
  isLoading,
  isAuthenticated,
  user,
  roleClaimNamespace,
  isGuest = false,
}) {
  if (isLoading) return AUTH_STATUS.LOADING;
  if (isGuest) return AUTH_STATUS.GUEST;
  if (!isAuthenticated) return AUTH_STATUS.ANONYMOUS;

  const tokenRole = user?.[`${roleClaimNamespace}/role`];
  const metadataRole = user?.app_metadata?.role;
  const role = tokenRole || metadataRole;

  if (role === 'freelancer') return AUTH_STATUS.AUTHENTICATED_FREELANCER;
  if (role === 'client') return AUTH_STATUS.AUTHENTICATED_CLIENT;

  return AUTH_STATUS.AUTHENTICATED_NO_ROLE;
}
