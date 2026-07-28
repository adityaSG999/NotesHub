"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import NoteCard from './NoteCard';
import Skeleton from '@/components/common/Skeleton';

const PAGE_SIZE = 20;

export default function BookmarkList({ initialBookmarks, currentUser }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialBookmarks.length >= PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(false);
  const sentinelRef = useRef(null);
  const loadingTimerRef = useRef(null);

  const fetchMoreBookmarks = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadError('');
    loadingTimerRef.current = window.setTimeout(() => setShowSkeleton(true), 200);

    try {
      const nextPage = page + 1;
      const url = new URL('/api/bookmarks', window.location.origin);
      url.searchParams.set('page', String(nextPage));

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not load more bookmarks.');
      }

      setBookmarks((prev) => [...prev, ...data.bookmarks]);
      setPage(nextPage);
      setHasMore(Boolean(data.hasMore));
    } catch (error) {
      setLoadError(error.message || 'Could not load more bookmarks.');
    } finally {
      window.clearTimeout(loadingTimerRef.current);
      setShowSkeleton(false);
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, page]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreBookmarks();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchMoreBookmarks, hasMore]);

  return (
    <div className="divide-y divide-outline">
      {bookmarks.length === 0 ? (
        <div className="text-center py-20 text-text-muted flex flex-col items-center gap-4">
          <p className="font-semibold text-text-primary">Nothing saved yet</p>
          <p className="text-sm">Tap the bookmark icon on any note to save it here.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-outline">
          {bookmarks.map((note) => (
            <div key={note.id} className="px-4 py-4">
              <NoteCard note={note} currentUserId={currentUser.id} currentUser={currentUser} />
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-6 flex flex-col items-center gap-2 text-sm text-text-muted">
        {loadError ? (
          <div className="text-error">
            <p>{loadError}</p>
            <button type="button" onClick={fetchMoreBookmarks} className="mt-2 text-primary underline">
              Retry
            </button>
          </div>
        ) : null}

        {showSkeleton ? (
          <div className="w-full space-y-4">
            {[1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-28 rounded-card mx-auto" />
            ))}
          </div>
        ) : null}

        {!showSkeleton && !isLoadingMore && !loadError && !hasMore && bookmarks.length > 0 ? (
          <p>No more saved notes.</p>
        ) : null}

        <div ref={sentinelRef} className="h-2 w-full" />
      </div>
    </div>
  );
}
