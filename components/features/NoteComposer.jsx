"use client";

import { useState } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { PenLine } from 'lucide-react';

export default function NoteComposer({ currentUser, onOptimisticNote, onNoteCreated, onNoteCreateFailed }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Thoughts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_CHARS = 2000;
  const MAX_TITLE = 100;
  const categories = ['Tech', 'Life', 'Thoughts', 'Learning', 'Ideas', 'Design', 'Career', 'Questions', 'Updates', 'Resources'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length > MAX_TITLE) {
      setError(`Title cannot exceed ${MAX_TITLE} characters.`);
      return;
    }

    if (!trimmedContent) {
      setError('Please enter some content before publishing.');
      return;
    }

    if (trimmedContent.length > MAX_CHARS) {
      setError(`Content cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    const tempNote = {
      id: `temp-${Date.now()}`,
      title: trimmedTitle || undefined,
      content: trimmedContent,
      category,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
      },
      hasLiked: false,
      hasBookmarked: false,
      likesCount: 0,
      userFlagStatus: null,
      pending: true,
    };

    setLoading(true);
    setError('');

    if (onOptimisticNote) onOptimisticNote(tempNote);
    setTitle('');
    setContent('');

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: tempNote.title, content: tempNote.content, category })
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : {};

      if (data.success) {
        if (onNoteCreated) onNoteCreated(data.note, tempNote.id);
      } else {
        if (onNoteCreateFailed) onNoteCreateFailed(tempNote.id);
        setError(data.message || 'Failed to post note');
      }
    } catch (err) {
      if (onNoteCreateFailed) onNoteCreateFailed(tempNote.id);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-outline rounded-card p-4 shadow-soft">
      <div className="flex gap-3">
        <Avatar src={currentUser?.avatarUrl} size="md" username={currentUser?.username} />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE}
            placeholder="Title (optional)"
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base md:text-lg mb-3"
          />
          <textarea
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted resize-none outline-none text-base md:text-lg min-h-[80px]"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CHARS}
          />

          {error && <p className="text-error text-xs mb-2">{error}</p>}

          <div className="flex items-center justify-between border-t border-outline pt-3 mt-2">
            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-surface-container text-text-secondary text-sm rounded-full px-3 py-1.5 outline-none border border-outline focus:border-primary appearance-none cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-xs font-medium ${content.length > MAX_CHARS - 100 ? 'text-error' : 'text-text-muted'}`}>
                {content.length}/{MAX_CHARS}
              </span>
              <Button type="submit" size="sm" loading={loading} disabled={!content.trim() || content.length > MAX_CHARS}>
                <PenLine className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
