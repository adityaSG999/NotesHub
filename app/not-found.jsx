'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-surface to-background px-4 py-10 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl sm:h-[420px] sm:w-[420px]" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="select-none text-[7rem] font-black leading-none text-primary/5 sm:text-[10rem] lg:text-[16rem]">
            404
          </span>
        </div>
      </div>

      <section className="relative z-10 w-full max-w-xl rounded-3xl border border-outline/60 bg-background/80 p-6 shadow-xl backdrop-blur-xl sm:p-8 lg:p-10">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
          <Search className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
        </div>

        {/* Badge */}
        <div className="mt-6 text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Error 404
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-text-secondary sm:text-base">
          The page you're looking for may have been moved, deleted, or the URL
          you entered is incorrect.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white hover:bg-primary-hover sm:w-auto"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-outline bg-background px-5 py-3 font-medium text-text-primary hover:bg-surface-hover cursor-pointer sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-outline/60 pt-6">
          <p className="text-center text-sm text-text-secondary">
            Need help? Return to the homepage and continue exploring.
          </p>
        </div>
      </section>
    </main>
  );
}