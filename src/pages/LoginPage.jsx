import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppAuth } from '../auth/AppAuthProvider';

export default function LoginPage() {
  const { loginWithRedirect, enterGuestMode } = useAppAuth();
  const navigate = useNavigate();

  const handleGuest = () => {
    enterGuestMode();
    navigate('/guest');
  };

  return (
    <main>
      <h1>Log in</h1>
      <p>Choose whether you want to sign in or continue as a guest.</p>
      <button
        onClick={() =>
          loginWithRedirect({
            appState: { returnTo: '/app' },
          })
        }
      >
        Continue with Auth0
      </button>
      <button onClick={handleGuest}>Continue as Guest</button>
    </main>
  );
}
