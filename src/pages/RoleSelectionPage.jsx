import React, { useMemo, useState } from 'react';

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const sessionToken = useMemo(() => getQueryParam('session_token'), []);
  const state = useMemo(() => getQueryParam('state'), []);
  const continueUrl = useMemo(() => {
    const continueUriFromUrl = getQueryParam('continue_uri');
    if (continueUriFromUrl) return continueUriFromUrl;
    return `https://${import.meta.env.VITE_AUTH0_DOMAIN}/continue`;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError('Select Freelancer or Client.');
      return;
    }

    if (!sessionToken || !state) {
      setError('Missing Auth0 transaction details.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/build-continue-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken, state, role: selectedRole }),
        }
      );

      if (!response.ok) throw new Error('Could not prepare onboarding response.');

      const { continueToken } = await response.json();

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = continueUrl;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'session_token';
      tokenInput.value = continueToken;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Choose your role</h1>
        <p>This appears once. Your selection decides which workspace loads after login.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <button
              type="button"
              className={selectedRole === 'freelancer' ? 'active' : ''}
              onClick={() => setSelectedRole('freelancer')}
            >
              <h2>Freelancer</h2>
              <p>I provide services, respond to deals, and manage opportunities.</p>
            </button>

            <button
              type="button"
              className={selectedRole === 'client' ? 'active' : ''}
              onClick={() => setSelectedRole('client')}
            >
              <h2>Client</h2>
              <p>I create deals, hire freelancers, and manage projects.</p>
            </button>
          </div>

          {error ? <p>{error}</p> : null}

          <button type="submit" disabled={submitting || !selectedRole}>
            {submitting ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </section>
    </main>
  );
}
