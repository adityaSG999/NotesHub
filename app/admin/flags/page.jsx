"use client";

import { useState, useEffect } from 'react';
import { Flag, CheckCircle, XCircle, Trash2, Heart, Bookmark, Calendar, User, AlertCircle } from 'lucide-react';
import Avatar from '@/components/common/Avatar';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      case 'DISMISSED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
              <div key={flag.id} className="p-5 hover:bg-surface-container transition-colors">
                {/* Flag Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(flag.status)}`}>
                        {flag.status}
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">
                        Flag ID: {flag.id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar 
                        src={flag.reporter?.avatarUrl} 
                        username={flag.reporter?.username} 
                        size="sm"
                      />
                      <div>
                        <p className="text-xs text-text-muted">
                          Reported by <span className="font-semibold text-text-secondary">@{flag.reporter?.username}</span>
                        </p>
                        <p className="text-xs text-text-muted">
                          {new Date(flag.createdAt).toLocaleDateString()} at {new Date(flag.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-error/5 border border-error/20 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-error">&ldquo;{flag.reason}&rdquo;</p>
                    </div>
                  </div>
                  {filter === 'PENDING' && (
                    <div className="flex flex-col gap-2 shrink-0">
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
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar 
                        src={flag.note.author?.avatarUrl} 
                        username={flag.note.author?.username} 
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-text-primary text-sm">@{flag.note.author?.username}</span>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs text-text-muted">{flag.note.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            flag.note.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {flag.note.status}
                          </span>
                        </div>
                        {flag.note.title && (
                          <h3 className="font-semibold text-text-primary text-sm mb-1">{flag.note.title}</h3>
                        )}
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{flag.note.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-3 border-t border-outline text-xs text-text-muted">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{flag.note.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{flag.note.bookmarksCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(flag.note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>Note ID: {flag.note.id.slice(0, 8)}...</span>
                      </div>
                    </div>
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
