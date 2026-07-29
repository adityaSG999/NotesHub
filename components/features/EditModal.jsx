"use client";

import { useState } from 'react';
import Avatar from '../common/Avatar';
import { X, Save } from 'lucide-react';

export default function EditModal({ note, currentUser, onClose, onUpdate }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  console.log(note);
  const validCategories = ['Tech', 'Life', 'Thoughts', 'Learning', 'Ideas', 'Design', 'Career', 'Questions', 'Updates', 'Resources'];
  const normalizedCategory = note.category 
    ? validCategories.find(cat => cat.toLowerCase() === note.category.toLowerCase()) || 'Thoughts'
    : 'Thoughts';
  const [category, setCategory] = useState(normalizedCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_CHARS = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    const trimmedTitle = title.trim();

    if (!trimmedContent) {
      setError('Content cannot be blank.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Title cannot exceed 100 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate(data.note);
        onClose();
      } else {
        setError(data.message || 'Failed to update note.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface border border-outline rounded-card w-full max-w-lg shadow-hover">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
          <h2 className="font-bold text-text-primary">Edit Note</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex gap-3 mb-4">
            <Avatar src={currentUser?.avatarUrl} size="md" username={currentUser?.username} />
            <div className="flex-1">
              <input
                type="text"
                className="w-full bg-transparent text-text-primary font-bold text-lg placeholder:text-text-muted outline-none mb-2"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              <textarea
                autoFocus
                className="w-full bg-transparent text-text-primary placeholder:text-text-muted resize-none outline-none text-base min-h-[120px]"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CHARS}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm text-text-muted">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-surface-container border border-outline rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none focus:ring-1 focus:ring-primary"
            >
    {validCategories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}

            </select>
          </div>

          {error && <p className="text-error text-xs mb-3">{error}</p>}

          <div className="flex items-center justify-between border-t border-outline pt-3">
            <span className={`text-xs font-medium ${content.length > MAX_CHARS - 100 ? 'text-error' : 'text-text-muted'}`}>
              {content.length}/{MAX_CHARS}
            </span>
            <button
              type="submit"
              disabled={!content.trim() || loading}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-button text-sm font-semibold hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><Save className="w-4 h-4" />Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
