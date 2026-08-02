"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
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
   <div className="min-h-screen bg-background">

  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">


    {/* LEFT SIDE - DESKTOP */}
    <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/70 p-12">

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-md text-center text-white">

        <Link href="/">
          <Image
            src="/android-chrome-512x512.png"
            alt="Logo"
            width={220}
            height={220}
            className="mx-auto rounded-3xl shadow-2xl cursor-pointer hover:scale-105 transition-transform"
            priority
          />
        </Link>

        <h1 className="mt-8 text-5xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-5 text-lg leading-8 text-white/90">
          Sign in to access your dashboard and continue managing your account.
        </p>

      </div>

    </div>



    {/* MOBILE BRAND */}
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/70 px-6 py-8 text-center text-white lg:hidden">

      <Link href="/">
        <Image
          src="/android-chrome-512x512.png"
          alt="Logo"
          width={90}
          height={90}
          className="rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform"
          priority
        />
      </Link>

      <h1 className="mt-4 text-3xl font-bold">
        Welcome Back
      </h1>

      <p className="mt-2 max-w-sm text-sm text-white/90">
        Sign in to access your dashboard and continue managing your account.
      </p>

    </div>



    {/* RIGHT FORM */}
    <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-soft border border-outline sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">


        {/* Header */}
        <div className="mb-8 text-center lg:text-left">

          <h2 className="text-3xl font-bold text-text-primary">
            Sign In
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            Enter your details to access your account.
          </p>

        </div>



        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          {error && (
            <div className="border border-error/20 bg-error/10 px-4 py-3 text-center text-sm text-error">
              {error}
            </div>
          )}



          {/* Email */}
          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="john@example.com"
              className="w-full border border-outline bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

          </div>



          {/* Password */}
          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              placeholder="••••••••"
              className="w-full border border-outline bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

          </div>



          <Button
            type="submit"
            className="mt-2 w-full"
            size="lg"
            loading={loading}
          >
            Sign In
          </Button>


        </form>



        <p className="mt-8 text-center text-sm text-text-secondary">

          Don't have an account?{" "}

          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Create one now
          </Link>

        </p>


      </div>

    </div>


  </div>

</div>

  );
}
