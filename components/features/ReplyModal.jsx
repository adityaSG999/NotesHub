"use client";

import { useState } from 'react';
import Avatar from '../common/Avatar';
import { X, Send } from 'lucide-react';

export default function ReplyModal({ note, currentUser, onClose, onReplyCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const MAX_CHARS = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError('Please enter a reply before submitting.');
      return;
    }

    if (trimmedContent.length > MAX_CHARS) {
      setError(`Reply cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `@${note.author?.username} ${content}`,
          category: note.category || 'Thoughts',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (onReplyCreated && data.note) {
          onReplyCreated(data.note);
        }
        setTimeout(() => onClose(), 1200);
      } else {
        setError(data.message || 'Failed to post reply.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface border border-outline rounded-card w-full max-w-lg shadow-hover">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
          <h2 className="font-bold text-text-primary">Reply</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Original Note Preview */}
        <div className="px-5 py-4 border-b border-outline bg-surface-dim">
          <div className="flex items-center gap-2 mb-2">
            <Avatar src={note.author?.avatarUrl} size="sm" username={note.author?.username} />
            <span className="text-sm font-semibold text-text-secondary">@{note.author?.username}</span>
          </div>
          <p className="text-sm text-text-muted line-clamp-2">{note.content}</p>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex gap-3">
            <Avatar src={currentUser?.avatarUrl} size="md" username={currentUser?.username} />
            <div className="flex-1">
              <textarea
                autoFocus
                className="w-full bg-transparent text-text-primary placeholder:text-text-muted resize-none outline-none text-base min-h-[80px]"
                placeholder={`Replying to @${note.author?.username}...`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CHARS}
              />
            </div>
          </div>

          {error && <p className="text-error text-xs mt-2 ml-12">{error}</p>}
          {success && <p className="text-green-600 text-xs mt-2 ml-12 font-medium">Reply posted!</p>}

          <div className="flex items-center justify-between border-t border-outline pt-3 mt-3">
            <span className={`text-xs font-medium ml-12 ${content.length > MAX_CHARS - 50 ? 'text-error' : 'text-text-muted'}`}>
              {content.length}/{MAX_CHARS}
            </span>
            <button
              type="submit"
              disabled={!content.trim() || loading || success}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-button text-sm font-semibold hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Posting...' : <><Send className="w-4 h-4" />Reply</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
