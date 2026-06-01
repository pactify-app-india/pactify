import React from 'react';
import { useAppAuth } from '../auth/AppAuthProvider';

export default function GuestHomePage() {
  const { loginWithRedirect } = useAppAuth();

  return (
    <main>
      <h1>Guest Preview</h1>
      <p>You can explore the platform here, but creating a deal requires login.</p>
      <button
        onClick={() =>
          loginWithRedirect({
            appState: { returnTo: '/app' },
          })
        }
      >
        Log in to create a deal
      </button>
    </main>
  );
}
