"use client";

import { useState } from 'react';

export default function FollowButton({ targetUserId, initialIsFollowing, onFollowStateChange }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    const nextState = !isFollowing;
    setLoading(true);
    setIsFollowing(nextState);

    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsFollowing(!nextState);
      } else if (onFollowStateChange) {
        onFollowStateChange(nextState);
      }
    } catch {
      setIsFollowing(!nextState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-button px-5 py-1.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-60 ${
        isFollowing
          ? 'border border-outline text-text-primary hover:bg-error/10 hover:text-error hover:border-error'
          : 'bg-primary text-white hover:bg-primary-hover shadow-soft'
      }`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
