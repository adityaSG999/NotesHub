"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formRef.current && !formRef.current.checkValidity()) {
      setError('Please enter a valid email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <div className="text-error bg-error/10 p-3 rounded-md text-sm text-center">{error}</div>}
        
        <div className="space-y-4 rounded-md shadow-sm">
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
            <div className="flex justify-between items-center mt-1">
               <label className="text-sm font-medium text-text-primary" htmlFor="password">Password</label>
               <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-hover">Forgot password?</Link>
            </div>
            <input
              id="password"
              type="password"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-3 border border-outline placeholder-text-muted text-text-primary bg-surface rounded-input focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign In
          </Button>
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
          Create one now
        </Link>
      </p>
    </div>
  );
}
