"use client";

import { useEffect, useState } from 'react';

export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (!canceled) {
          if (data.success) {
            setUser(data.user);
          } else {
            setError(data.message || 'Unable to load session');
          }
        }
      } catch (err) {
        if (!canceled) {
          setError('Unable to load session');
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    fetchSession();
    return () => {
      canceled = true;
    };
  }, []);

  return { user, loading, error };
}
