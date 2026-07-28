"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Avatar from '../common/Avatar';
import { Heart, Bookmark, MessageSquare, MoreHorizontal, Flag, Trash2, Edit } from 'lucide-react';
import EditModal from './EditModal';
import ReplyModal from './ReplyModal';

export default function NoteCard({ note, currentUserId, currentUser }) {
  const [isLiked, setIsLiked] = useState(note.hasLiked || false);
  const [likesCount, setLikesCount] = useState(note.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(note.hasBookmarked || false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState('');
  const [flagStatus, setFlagStatus] = useState(note.userFlagStatus || null);
  const [editOpen, setEditOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [localNote, setLocalNote] = useState(note);
  const [pendingAction, setPendingAction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setIsLiked(Boolean(note.hasLiked));
    setLikesCount(note.likesCount || 0);
    setIsBookmarked(Boolean(note.hasBookmarked));
    setFlagStatus(note.userFlagStatus || null);
    setLocalNote(note);
  }, [note]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const isOwner = currentUserId === note.author?.id;
  const isPending = localNote.pending === true;

  const handleLikeToggle = async () => {
    if (pendingAction || isPending) return;

    const nextLiked = !isLiked;
    setPendingAction('like');
    setIsLiked(nextLiked);
    setLikesCount((count) => count + (nextLiked ? 1 : -1));

    try {
      const res = await fetch(`/api/notes/${note.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        setIsLiked(isLiked);
        setLikesCount((count) => count + (nextLiked ? -1 : 1));
      }
    } catch {
      setIsLiked(isLiked);
      setLikesCount((count) => count + (nextLiked ? -1 : 1));
    } finally {
      setPendingAction(null);
    }
  };

  const handleBookmarkToggle = async () => {
    if (pendingAction) return;

    const nextBookmarked = !isBookmarked;
    setPendingAction('bookmark');
    setIsBookmarked(nextBookmarked);

    try {
      const res = await fetch(`/api/notes/${note.id}/bookmark`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) setIsBookmarked(isBookmarked);
    } catch {
      setIsBookmarked(isBookmarked);
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this note? This cannot be undone.')) return;

    setMenuOpen(false);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
      if (res.ok) {
        setLocalNote((prev) => ({ ...prev, status: 'DELETED' }));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim() || reportReason.length < 5) return;
    try {
      const res = await fetch(`/api/notes/${note.id}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });
      const data = await res.json();

      if (!res.ok) {
        setReportStatus(data.message || 'Failed to report. Please try again.');
        return;
      }

      const nextStatus = data.flag?.status || 'PENDING';
      setFlagStatus(nextStatus);
      setReportStatus(data.message || 'Report submitted.');
      setTimeout(() => {
        setReportOpen(false);
        setReportStatus('');
        setReportReason('');
      }, 2200);
    } catch {
      setReportStatus('Failed to report. Please try again.');
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    setLocalNote(updatedNote);
  };

  if (isDeleting || localNote.status === 'DELETED') return null;

  return (
    <article className="bg-surface border border-outline rounded-card p-4 shadow-soft hover:shadow-hover transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/profile/${note.author?.username}`} className="flex items-center gap-3 group">
          <Avatar src={note.author?.avatarUrl} alt={note.author?.username} size="md" username={note.author?.username} />
          <div>
            <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
              @{note.author?.username || 'Unknown'}
            </span>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              <span>{formattedDate}</span>
              {note.category && (
                <><span>&middot;</span>
                <span className="bg-surface-container px-2 py-0.5 rounded-full">{note.category}</span></>
              )}
            </div>
          </div>
        </Link>

        {/* Overflow menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-text-muted hover:bg-surface-container p-1.5 rounded-full transition-colors active:scale-95"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-surface border border-outline rounded-xl shadow-hover z-50 w-40 overflow-hidden py-1">
              {isOwner ? (
                <>
                  <button
                    onClick={() => { setMenuOpen(false); setEditOpen(true); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-container transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit Note
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Note
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); setReportOpen(true); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-container transition-colors"
                >
                  <Flag className="w-4 h-4" /> Report Note
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 pl-1">
        {localNote.title && <h3 className="text-lg font-bold text-text-primary mb-1 leading-snug">{localNote.title}</h3>}
        <p className="text-text-primary leading-relaxed whitespace-pre-wrap text-sm md:text-base">{localNote.content}</p>
      </div>

      {flagStatus && (
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-error/10 px-2.5 py-1 text-[11px] font-semibold text-error">
            Report status: {flagStatus.toLowerCase()}
          </span>
        </div>
      )}

      {/* Engagement Bar */}
      <div className="flex items-center gap-1 text-text-muted border-t border-outline pt-3">
        <button
          onClick={handleLikeToggle}
          disabled={pendingAction !== null || isPending}
          aria-label="Like"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 active:scale-95 disabled:opacity-70 ${isLiked ? 'text-red-500 bg-red-500/10' : 'hover:bg-surface-container hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} />
          <span className="text-xs font-medium">{likesCount}</span>
        </button>

        <button
          onClick={() => setReplyOpen(true)}
          aria-label="Reply"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-surface-container hover:text-primary transition-colors active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-medium">Reply</span>
        </button>

        <button
          onClick={handleBookmarkToggle}
          disabled={pendingAction !== null || isPending}
          aria-label="Bookmark"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 active:scale-95 ml-auto disabled:opacity-70 ${isBookmarked ? 'text-primary bg-primary/10' : 'hover:bg-surface-container hover:text-primary'}`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Inline Report Dialog */}
      {reportOpen && (
        <div className="mt-3 p-3 bg-surface-container border border-outline rounded-xl">
          <p className="text-xs font-semibold text-text-primary mb-2">Why are you reporting this note?</p>
          <textarea
            className="w-full bg-surface border border-outline rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none outline-none focus:ring-1 focus:ring-primary"
            rows={2}
            placeholder="Spam, harassment, misinformation..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          {reportStatus ? (
            <p className="text-xs mt-2 text-primary font-medium">{reportStatus}</p>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              {flagStatus && (
                <p className="text-[11px] text-text-muted">
                  You already submitted a report for this note. Current status: <span className="font-semibold text-error">{flagStatus.toLowerCase()}</span>
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleReport}
                  disabled={reportReason.length < 5 || !!flagStatus}
                  className="px-3 py-1.5 text-xs bg-error text-white rounded-lg disabled:opacity-50 hover:bg-error/90 active:scale-95 transition-all"
                >
                  {flagStatus ? 'Already Reported' : 'Submit Report'}
                </button>
                <button
                  onClick={() => { setReportOpen(false); setReportReason(''); }}
                  className="px-3 py-1.5 text-xs bg-surface-container text-text-secondary rounded-lg hover:bg-outline active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <EditModal
          note={localNote}
          currentUser={currentUser}
          onClose={() => setEditOpen(false)}
          onUpdate={handleNoteUpdate}
        />
      )}

      {/* Reply Modal */}
      {replyOpen && (
        <ReplyModal
          note={localNote}
          currentUser={currentUser}
          onClose={() => setReplyOpen(false)}
        />
      )}
    </article>
  );
}
