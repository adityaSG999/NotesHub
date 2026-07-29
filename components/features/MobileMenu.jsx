"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, X } from 'lucide-react';

export default function MobileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-20 right-4 bg-surface border border-outline rounded-full p-3 shadow-lg z-40 hover:bg-surface-container transition-colors"
      >
        <Shield className="w-5 h-5 text-text-primary" />
      </button>
    );
  }

  return (
    <>
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />
      <div className="md:hidden fixed bottom-20 right-4 bg-surface border border-outline rounded-2xl shadow-xl z-50 w-56 overflow-hidden">
        <div className="p-4 border-b border-outline flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Menu</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-surface-container rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>
        <div className="p-2">
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => {
                router.push('/admin');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container text-text-primary transition-colors text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-error/10 text-error transition-colors text-sm font-medium mt-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
