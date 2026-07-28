"use client";

import { useEffect, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

export default function AdminNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notes?limit=50');
      const data = await res.json();
      setNotes(data.notes || []);
    } finally {
      setLoading(false);
    }
  };

  const filtered = notes.filter((note) =>
    note.title?.toLowerCase().includes(search.toLowerCase()) ||
    note.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">All Notes</h1>
          <p className="text-text-muted mt-1 text-sm">Review and moderate published notes.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-outline rounded-button text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface border border-outline rounded-card shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-outline">
          <h2 className="font-bold text-text-primary">Notes</h2>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5].map((key) => (
              <div key={key} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 items-center animate-pulse">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-outline">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                <p className="font-semibold">No notes found.</p>
              </div>
            ) : (
              filtered.map((note) => (
                <div key={note.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{note.title || note.content.slice(0, 60) + '...'}</p>
                    <p className="text-xs text-text-muted mt-0.5">{note.category}</p>
                  </div>
                  <span className="text-xs text-text-muted">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
