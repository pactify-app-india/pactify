const ALLOWED_ROLES = new Set(['freelancer', 'client']);

exports.onExecutePostLogin = async (event, api) => {
  const currentRole = event.user.app_metadata?.role;
  const loginCount = event.stats?.logins_count || 0;

  if (currentRole && ALLOWED_ROLES.has(currentRole)) {
    api.idToken.setCustomClaim(
      `${event.secrets.ROLE_CLAIM_NAMESPACE}/role`,
      currentRole
    );
    api.accessToken.setCustomClaim(
      `${event.secrets.ROLE_CLAIM_NAMESPACE}/role`,
      currentRole
    );
    return;
  }

  const isFirstLogin = loginCount <= 1;
  if (!isFirstLogin) return;

  const auth0Domain = event.request.hostname;
  const continueUri = `https://${auth0Domain}/continue`;

  const sessionToken = api.redirect.encodeToken({
    secret: event.secrets.REDIRECT_SECRET,
    expiresInSeconds: 60 * 10,
    payload: {
      sub: event.user.user_id,
      email: event.user.email,
      continue_uri: continueUri,
    },
  });

  api.redirect.sendUserTo(`${event.secrets.APP_BASE_URL}/onboarding/role-selection`, {
    query: {
      session_token: sessionToken,
    },
  });
};

exports.onContinuePostLogin = async (event, api) => {
  const payload = api.redirect.validateToken({
    secret: event.secrets.REDIRECT_SECRET,
    tokenParameterName: 'session_token',
  });

  const selectedRole = payload?.role;

  if (!ALLOWED_ROLES.has(selectedRole)) {
    api.access.deny('A valid role selection is required.');
    return;
  }

  api.user.setAppMetadata('role', selectedRole);

  api.idToken.setCustomClaim(
    `${event.secrets.ROLE_CLAIM_NAMESPACE}/role`,
    selectedRole
  );
  api.accessToken.setCustomClaim(
    `${event.secrets.ROLE_CLAIM_NAMESPACE}/role`,
    selectedRole
  );
};
