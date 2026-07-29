"use client";

import { useState, useEffect } from 'react';
import Avatar from '@/components/common/Avatar';
import { ShieldCheck, ShieldOff, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const confirmed = confirm(`${newStatus === 'BLOCKED' ? 'Block' : 'Unblock'} this user?`);
    if (!confirmed) return;

    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch {
      alert('Action failed.');
    }
  };

  const filtered = users.filter((u) =>
    u.username.includes(search.toLowerCase()) || u.email.includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="text-text-muted mt-1 text-sm">Manage platform accounts.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search by username..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-outline rounded-button text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface border border-outline rounded-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-surface-container border-b border-outline">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Notes</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {loading && (
                <tr><td colSpan={6} className="text-center py-10 text-text-muted animate-pulse">Loading users...</td></tr>
              )}
              {!loading && filtered.map((user) => (
                <tr key={user.id} className="hover:bg-surface-dim transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatarUrl} size="sm" username={user.username} />
                      <div>
                        <p className="font-medium text-text-primary">@{user.username}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-text-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{user._count?.notes ?? 0}</td>
                  <td className="px-5 py-3 text-text-muted text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/20' : 'bg-error/10 text-error'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => toggleBlock(user.id, user.status)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                          user.status === 'ACTIVE'
                            ? 'text-error hover:bg-error/10'
                            : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
