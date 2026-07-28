"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import NoteCard from '@/components/features/NoteCard';
import useSession from '@/components/hooks/useSession';
import Skeleton from '@/components/common/Skeleton';

const MIN_QUERY_LENGTH = 2;
const SKELETON_DELAY_MS = 200;

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);
  const skeletonTimerRef = useRef(null);
  const { user: currentUser } = useSession();

  const fetchResults = useCallback(async (searchQuery) => {
    const queryText = searchQuery.trim();
    if (queryText.length < MIN_QUERY_LENGTH) {
      controllerRef.current?.abort();
      setResults([]);
      setError('');
      setLoading(false);
      setShowSkeleton(false);
      setSearched(false);
      return;
    }

    setSearched(true);
    setError('');
    setLoading(true);
    setShowSkeleton(false);

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    skeletonTimerRef.current = window.setTimeout(() => {
      setShowSkeleton(true);
    }, SKELETON_DELAY_MS);

    try {
      const url = new URL('/api/search', window.location.origin);
      url.searchParams.set('q', queryText);

      const res = await fetch(url.toString(), { signal: controller.signal });
      if (!res.ok) throw new Error('Could not load results.');

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Could not load results.');

      setResults(data.notes || []);
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') return;
      setError(fetchError.message || 'Unable to load results.');
      setResults([]);
    } finally {
      window.clearTimeout(skeletonTimerRef.current);
      setShowSkeleton(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => fetchResults(query), 400);
    return () => {
      window.clearTimeout(timer);
      controllerRef.current?.abort();
    };
  }, [query, fetchResults]);

  const shouldShowEmptyState = searched && !loading && !showSkeleton && !error && results.length === 0;

  return (
    <div>
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-outline z-40 px-4 py-4">
        <h1 className="text-xl font-bold text-text-primary mb-3">Explore</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, topics, people..."
            className="w-full bg-surface-container border border-outline rounded-button pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="divide-y divide-outline">
        {error && (
          <div className="px-4 py-6 text-sm text-error">
            <p>{error}</p>
          </div>
        )}

        {shouldShowEmptyState && (
          <div className="text-center py-16 text-text-muted">
            <p className="font-semibold text-text-primary">No results found</p>
            <p className="text-sm mt-1">Try a different keyword or topic.</p>
          </div>
        )}

        {!searched && (
          <div className="text-center py-20 text-text-muted">
            <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Start typing to search notes</p>
          </div>
        )}

        {results.map((note) => (
          <div key={note.id} className="px-4 py-4">
            <NoteCard note={note} currentUserId={currentUser?.id} currentUser={currentUser} />
          </div>
        ))}

        {loading && showSkeleton && (
          <div className="space-y-4 py-8 px-4">
            {[1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-24 rounded-card" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
