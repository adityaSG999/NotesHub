"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Avatar from '@/components/common/Avatar';
import { LogOut, Settings } from 'lucide-react';

export default function UserNav({ user }) {
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
  };

  return (
    <div className="border-t border-outline pt-4 mt-auto">
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-surface-container transition-colors group">
        <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar src={user?.avatarUrl} size="sm" username={user?.username} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">@{user?.username}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-full transition-all active:scale-95 shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
