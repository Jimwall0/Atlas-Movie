import React, { useEffect, useState } from 'react';

type User = {
  login: string;
  email: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    fetch('http://localhost:4000/api/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // User is not logged in → redirect to login button
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <a href="http://localhost:4000/auth/login">
          <button>Login with GitHub</button>
        </a>
      </div>
    );
  }

  // User is logged in → show protected content
  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 20px',
          background: '#24292f',
          color: 'white',
          alignItems: 'center',
        }}
      >
        <div>{user.email}</div>
        <button
          onClick={handleLogout}
          style={{
            background: '#e55353',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      </header>

      <main style={{ padding: '20px' }}>
        <h1>Protected Page</h1>
        <p>This content is only visible to logged-in users.</p>
      </main>
    </div>
  );
}