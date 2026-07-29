"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, FileText, Users } from "lucide-react";
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
    <div className="min-h-screen bg-background">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">


        {/* LEFT SIDE - DESKTOP */}
        <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/70 p-12">

          <div className="absolute inset-0 bg-black/10" />

          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />


          <div className="relative z-10 max-w-md text-center text-white">


            {/* Logo */}
            <Image
              src="/android-chrome-512x512.png"
              alt="NotesHub Logo"
              width={220}
              height={220}
              className="mx-auto rounded-3xl bg-white shadow-2xl"
              priority
            />


            {/* Heading */}
            <h1 className="mt-8 text-5xl font-bold leading-tight">
              Join NotesHub
            </h1>


            <p className="mt-5 text-lg leading-8 text-white/90">
              Create your account and share ideas, knowledge,
              and meaningful notes with a growing community.
            </p>



            {/* Features */}
            <div className="mt-10 space-y-4 text-left">


              <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <span className="text-xl font-bold">
                    +
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold">
                    Share Ideas
                  </h3>

                  <p className="text-sm text-white/80">
                    Publish thoughts and knowledge instantly.
                  </p>
                </div>

              </div>



              <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <span className="text-xl font-bold">
                    ✎
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold">
                    Create Notes
                  </h3>

                  <p className="text-sm text-white/80">
                    Organize your learning and ideas.
                  </p>
                </div>

              </div>



              <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <span className="text-xl font-bold">
                    ◎
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold">
                    Build Community
                  </h3>

                  <p className="text-sm text-white/80">
                    Connect with creators and readers.
                  </p>
                </div>

              </div>


            </div>
          </div>

        </div>



        {/* MOBILE BRAND */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/70 px-6 py-8 text-center text-white lg:hidden">

          <Image
            src="/android-chrome-512x512.png"
            alt="Logo"
            width={90}
            height={90}
            className="rounded-2xl shadow-xl"
            priority
          />


          <h1 className="mt-4 text-3xl font-bold">
            Join NotesHub
          </h1>


          <p className="mt-2 max-w-sm text-sm text-white/90">
            Create your account and start sharing your thoughts.
          </p>

        </div>




        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">


          <div className="w-full max-w-md rounded-2xl border border-outline bg-surface p-6 shadow-soft sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">



            {/* Header */}
            <div className="mb-8 text-center lg:text-left">

              <h2 className="text-3xl font-bold text-text-primary">
                Create account
              </h2>


              <p className="mt-2 text-sm text-text-secondary">
                Join NotesHub and start sharing your ideas.
              </p>

            </div>




            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >


              {error && (
                <div className="border border-error/20 bg-error/10 px-4 py-3 text-center text-sm text-error">
                  {error}
                </div>
              )}




              {/* Username */}
              <div>

                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Username
                </label>


                <input
                  id="username"
                  type="text"
                  required
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  className="w-full border border-outline bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

              </div>




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
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
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
                  minLength={6}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full border border-outline bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

              </div>




              <Button
                type="submit"
                className="mt-2 w-full"
                size="lg"
                loading={loading}
              >
                Create Account
              </Button>


            </form>




            <p className="mt-8 text-center text-sm text-text-secondary">

              Already have an account?{" "}


              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary-hover"
              >
                Sign in
              </Link>


            </p>


          </div>


        </div>


      </div>

    </div>
  );
}
