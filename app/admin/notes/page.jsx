"use client";

import { useEffect, useState } from 'react';
import { Search, FileText, Heart, Bookmark, Calendar, User, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';
import Avatar from '@/components/common/Avatar';

export default function AdminNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notes?limit=100');
      const data = await res.json();
      setNotes(data.notes || []);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Permanently delete this note? This action cannot be undone.')) return;
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch {
      alert('Delete failed. Please try again.');
    }
  };

  const filtered = notes.filter((note) =>
    note.title?.toLowerCase().includes(search.toLowerCase()) ||
    note.content?.toLowerCase().includes(search.toLowerCase()) ||
    note.author?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between">
          <h2 className="font-bold text-text-primary">Notes ({filtered.length})</h2>
          <span className="text-xs text-text-muted">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((key) => (
              <div key={key} className="space-y-3 animate-pulse">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                    <Skeleton className="h-3 w-1/2 rounded-lg" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-outline">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No notes found.</p>
              </div>
            ) : (
              <>
                {paginatedNotes.map((note) => (
                  <div key={note.id} className="p-5 hover:bg-surface-container transition-colors">
                    <div className="flex items-start gap-4">
                      <Avatar 
                        src={note.author?.avatarUrl} 
                        username={note.author?.username} 
                        size="md"
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-text-primary text-sm">@{note.author?.username}</span>
                              <span className="text-xs text-text-muted">•</span>
                              <span className="text-xs text-text-muted">{note.category}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                note.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {note.status}
                              </span>
                            </div>
                            {note.title && (
                              <h3 className="font-semibold text-text-primary text-base mb-1">{note.title}</h3>
                            )}
                            <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{note.content}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="shrink-0 p-2 hover:bg-error/10 rounded-lg text-error transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{note.likesCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{note.bookmarksCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span>ID: {note.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-outline flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                          currentPage === pageNum
                            ? 'bg-primary text-white shadow-soft'
                            : 'hover:bg-surface-container text-text-secondary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
