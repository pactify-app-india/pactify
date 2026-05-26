import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Login from './Login';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) return <div className="loading">Loading…</div>;

  if (!user) return <Login onLogin={() => {}} />;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-label="Pactify">
            <rect width="36" height="36" rx="10" fill="#01696f"/>
            <path d="M10 26V12h7c3.314 0 6 2.686 6 6s-2.686 6-6 6h-3v2h-4zm4-6h3a2 2 0 0 0 0-4h-3v4z" fill="white"/>
          </svg>
          <span>Pactify</span>
        </div>
        <div className="app-user">
          <span>{user.displayName || user.email}</span>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </header>
      <main className="app-main">
        <h2>Welcome, {user.displayName || user.email.split('@')[0]} 👋</h2>
        <p>You're signed in. Build your app here.</p>
      </main>
    </div>
  );
}
