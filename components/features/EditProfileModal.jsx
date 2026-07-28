"use client";

import { useState } from 'react';
import Avatar from '../common/Avatar';
import { X, Save } from 'lucide-react';

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidUrl = (value) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedBio = bio.trim();
    const trimmedAvatarUrl = avatarUrl.trim();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      setError('Username must be between 3 and 30 characters.');
      return;
    }

    if (trimmedBio.length > 500) {
      setError('Bio cannot exceed 500 characters.');
      return;
    }

    if (trimmedAvatarUrl && !isValidUrl(trimmedAvatarUrl)) {
      setError('Avatar URL must be a valid URL or left empty.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bio, avatarUrl }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate(data.user);
        onClose();
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface border border-outline rounded-card w-full max-w-lg shadow-hover">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
          <h2 className="font-bold text-text-primary">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={avatarUrl} size="xl" username={username} />
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-primary mb-2">Avatar URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-surface-container border border-outline rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container border border-outline rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary"
              placeholder="@username"
              minLength={3}
              maxLength={30}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text-primary mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full bg-surface-container border border-outline rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none outline-none focus:ring-1 focus:ring-primary"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-text-muted mt-1">{bio.length}/500</p>
          </div>

          {error && <p className="text-error text-xs mb-4">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-button text-sm font-semibold hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><Save className="w-4 h-4" />Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
