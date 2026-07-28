"use client";

import { useState, useEffect } from 'react';
import { Flag, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function FlagsPage() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    fetchFlags();
  }, [filter]);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/flags?status=${filter}`);
      const data = await res.json();
      setFlags(data.flags || []);
    } catch (e) {
      setFlags([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (flagId, action) => {
    try {
      await fetch(`/api/admin/flags/${flagId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setFlags((prev) => prev.filter((f) => f.id !== flagId));
    } catch (e) {
      alert('Action failed. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId, flagId) => {
    if (!confirm('Permanently delete this note? This action cannot be undone.')) return;
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      setFlags((prev) => prev.filter((f) => f.id !== flagId));
    } catch {
      alert('Delete failed. Please try again.');
    }
  };

  const filterTabs = ['PENDING', 'RESOLVED', 'DISMISSED'];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Flagged Content</h1>
          <p className="text-text-muted mt-1 text-sm">Review and moderate reported notes.</p>
        </div>
        <div className="flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                filter === tab ? 'bg-primary text-white shadow-soft' : 'bg-surface-container text-text-secondary hover:bg-outline'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-outline rounded-card shadow-soft">
        {loading && (
          <div className="text-center py-16 text-text-muted animate-pulse text-sm">Loading flags...</div>
        )}

        {!loading && flags.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3 text-text-muted">
            <Flag className="w-10 h-10 opacity-20" />
            <p className="font-semibold">No {filter.toLowerCase()} flags</p>
          </div>
        )}

        {!loading && flags.length > 0 && (
          <div className="divide-y divide-outline">
            {flags.map((flag) => (
              <div key={flag.id} className="p-5 flex flex-col gap-3">
                {/* Flag Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">
                      Reported by <span className="font-semibold text-text-secondary">@{flag.reporter?.username}</span>
                      &nbsp;&middot;&nbsp;{new Date(flag.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-error">&ldquo;{flag.reason}&rdquo;</p>
                  </div>
                  {filter === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(flag.id, 'RESOLVED')}
                        title="Resolve flag"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs font-medium transition-colors active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4" /> Resolve
                      </button>
                      <button
                        onClick={() => handleAction(flag.id, 'DISMISSED')}
                        title="Dismiss flag"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-text-secondary hover:bg-outline text-xs font-medium transition-colors active:scale-95"
                      >
                        <XCircle className="w-4 h-4" /> Dismiss
                      </button>
                      <button
                        onClick={() => handleDeleteNote(flag.noteId, flag.id)}
                        title="Delete note"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 text-xs font-medium transition-colors active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Note
                      </button>
                    </div>
                  )}
                </div>

                {/* Flagged Note Preview */}
                {flag.note && (
                  <div className="bg-surface-container border border-outline rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1">
                      by <span className="font-semibold">@{flag.note.author?.username}</span> &middot; {flag.note.category}
                    </p>
                    {flag.note.title && <p className="font-semibold text-text-primary text-sm mb-1">{flag.note.title}</p>}
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{flag.note.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
