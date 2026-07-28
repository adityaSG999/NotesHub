"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formRef.current && !formRef.current.checkValidity()) {
      setError('Please fill out all required fields with valid values.');
      return;
    }

    const trimmedUsername = formData.username.trim();
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30 || !usernameRegex.test(trimmedUsername)) {
      setError('Username must be 3-30 characters and can only include letters, numbers, and underscores.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <div className="text-error bg-error/10 p-3 rounded-md text-sm text-center">{error}</div>}
        
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label className="text-sm font-medium text-text-primary" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-3 border border-outline placeholder-text-muted text-text-primary bg-surface rounded-input focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-3 border border-outline placeholder-text-muted text-text-primary bg-surface rounded-input focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="mt-1 appearance-none relative block w-full px-3 py-3 border border-outline placeholder-text-muted text-text-primary bg-surface rounded-input focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create Account
          </Button>
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
}
