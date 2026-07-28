"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import NoteComposer from './NoteComposer';
import NoteCard from './NoteCard';
import Skeleton from '@/components/common/Skeleton';

export default function HomeFeed({ initialNotes, initialNextCursor, currentUser }) {
  const [notes, setNotes] = useState(initialNotes);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(Boolean(initialNextCursor));
  const [loadError, setLoadError] = useState('');
  const sentinelRef = useRef(null);

  const handleOptimisticNote = (tempNote) => {
    setNotes((prev) => [tempNote, ...prev]);
  };

  const handleNoteCreated = (savedNote, tempId) => {
    setNotes((prev) => {
      if (tempId) {
        return prev.map((note) => (note.id === tempId ? savedNote : note));
      }
      return [savedNote, ...prev];
    });
  };

  const handleNoteCreateFailed = (tempId) => {
    setNotes((prev) => prev.filter((note) => note.id !== tempId));
  };

  const fetchMoreNotes = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadError('');

    try {
      const url = new URL('/api/notes', window.location.origin);
      url.searchParams.set('cursor', nextCursor);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoadError(data.message || 'Could not load more notes.');
        return;
      }

      setNotes((prev) => [...prev, ...data.notes]);
      setNextCursor(data.nextCursor || null);
      setHasMore(Boolean(data.nextCursor));
    } catch (error) {
      setLoadError('Could not load more notes.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, nextCursor]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreNotes();
      }
    }, {
      rootMargin: '200px',
    });

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [fetchMoreNotes, hasMore]);

  return (
    <div className="divide-y divide-outline">
      <div className="px-4 py-4">
        <NoteComposer
          currentUser={currentUser}
          onOptimisticNote={handleOptimisticNote}
          onNoteCreated={handleNoteCreated}
          onNoteCreateFailed={handleNoteCreateFailed}
        />
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg font-semibold">No notes yet.</p>
          <p className="text-sm mt-1">Be the first to share something.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-outline">
            {notes.map((note) => (
              <div key={note.id} className="px-4 py-4">
                <NoteCard note={note} currentUserId={currentUser.id} currentUser={currentUser} />
              </div>
            ))}
          </div>

          <div className="px-4 py-6 flex flex-col items-center gap-2 text-sm text-text-muted">
            {loadError ? <p className="text-error">{loadError}</p> : null}
            {isLoadingMore ? (
              <div className="w-full space-y-4">
                {[1, 2, 3].map((index) => (
                  <Skeleton key={index} className="h-28 rounded-card mx-auto" />
                ))}
              </div>
            ) : !hasMore ? (
              <p>No more notes to load.</p>
            ) : null}
            <div ref={sentinelRef} className="h-2 w-full" />
          </div>
        </>
      )}
    </div>
  );
}
