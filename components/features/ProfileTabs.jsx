"use client";

import { useEffect, useRef, useState } from 'react';
import { FileText, Users, Heart, Flag } from 'lucide-react';
import NoteCard from './NoteCard';
import Avatar from '../common/Avatar';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

const TAB_CONFIG = [
  { key: 'notes', label: 'Notes', icon: FileText },
  { key: 'likes', label: 'Likes', icon: Heart },
  { key: 'followers', label: 'Followers', icon: Users },
  { key: 'following', label: 'Following', icon: Users },
];

export default function ProfileTabs({
  profileUser,
  currentUserId,
  currentUser,
  isOwnProfile,
  initialTab,
  initialNotes,
  initialLikes,
  initialFollowers,
  initialFollowing,
  initialFlags,
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'notes');
  const [tabData, setTabData] = useState({
    notes: initialNotes,
    likes: initialLikes,
    followers: initialFollowers,
    following: initialFollowing,
    flags: initialFlags,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(false);
  const tabFetchRef = useRef(null);
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  useEffect(() => {
    if (tabData[activeTab] === undefined) {
      loadTabContent(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function loadTabContent(tab) {
    if (tabData[tab] !== undefined || isLoading) return;

    setIsLoading(true);
    setError('');
    tabFetchRef.current = tab;
    loadingTimerRef.current = window.setTimeout(() => setShowSkeleton(true), 200);

    try {
      const res = await fetch(`/api/profile/${profileUser.username}?tab=${tab}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not load this section.');
      }

      setTabData((prev) => ({ ...prev, [tab]: data.data ?? [] }));
    } catch (err) {
      setError(err.message || 'Could not load this section.');
    } finally {
      window.clearTimeout(loadingTimerRef.current);
      setShowSkeleton(false);
      setIsLoading(false);
      tabFetchRef.current = null;
    }
  }

  const displayedData = tabData[activeTab];
  const isTabLoading = isLoading && tabFetchRef.current === activeTab;

  function handleTabClick(tab) {
    if (tab === activeTab) return;
    setError('');
    setActiveTab(tab);
  }

  function renderTabButton(tab) {
    const isActive = activeTab === tab.key;
    const Icon = tab.icon;

    return (
      <button
        key={tab.key}
        type="button"
        onClick={() => handleTabClick(tab.key)}
        aria-selected={isActive}
        className={`flex-1 rounded-t-md border-b-2 px-3 py-3 text-left text-sm font-medium transition-colors ${
          isActive
            ? 'border-primary text-primary'
            : 'border-transparent text-text-muted hover:text-text-primary'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{tab.label}</span>
          {typeof profileUser._count?.[tab.key] === 'number' && (
            <span className="text-text-secondary">({profileUser._count[tab.key]})</span>
          )}
        </div>
      </button>
    );
  }

  function renderEmptyState() {
    const labels = {
      notes: 'No notes published yet.',
      likes: 'No liked notes yet.',
      followers: 'No followers yet.',
      following: 'Not following anyone yet.',
      flags: 'No reports filed yet.',
    };

    return (
      <div className="text-center py-20 text-text-muted">
        <p className="font-semibold text-text-primary">{labels[activeTab]}</p>
      </div>
    );
  }

  function renderTabContent() {
    if (!displayedData || displayedData.length === 0) {
      return renderEmptyState();
    }

    if (activeTab === 'notes') {
      return displayedData.map((note) => (
        <div key={note.id} className="px-4 py-4">
          <NoteCard note={note} currentUserId={currentUserId} currentUser={currentUser} />
        </div>
      ));
    }

    if (activeTab === 'likes') {
      return displayedData.map((like) => (
        <div key={like.id} className="px-4 py-4">
          <NoteCard note={like.note} currentUserId={currentUserId} currentUser={currentUser} />
        </div>
      ));
    }

    if (activeTab === 'followers') {
      return displayedData.map((follow) => (
        <div key={follow.id} className="px-4 py-4 flex items-center gap-3">
          <Avatar src={follow.follower.avatarUrl} size="md" username={follow.follower.username} />
          <div>
            <Link href={`/profile/${follow.follower.username}`} className="font-semibold text-text-primary hover:text-primary">
              @{follow.follower.username}
            </Link>
          </div>
        </div>
      ));
    }

    if (activeTab === 'following') {
      return displayedData.map((follow) => (
        <div key={follow.id} className="px-4 py-4 flex items-center gap-3">
          <Avatar src={follow.following.avatarUrl} size="md" username={follow.following.username} />
          <div>
            <Link href={`/profile/${follow.following.username}`} className="font-semibold text-text-primary hover:text-primary">
              @{follow.following.username}
            </Link>
          </div>
        </div>
      ));
    }

    if (activeTab === 'flags') {
      return displayedData.map((flag) => (
        <div key={flag.id} className="px-4 py-4">
          <div className="bg-surface border border-outline rounded-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-text-muted mb-1">
                  Reported <span className="font-semibold text-text-secondary">@{flag.note.author.username}</span>
                  &nbsp;&middot;&nbsp;{new Date(flag.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm font-semibold text-text-primary">{flag.note.title || 'Untitled note'}</p>
                <p className="text-sm text-text-secondary mt-1">Reason: {flag.reason}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-error/10 px-2.5 py-1 text-[11px] font-semibold text-error">
                {flag.status.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      ));
    }

    return null;
  }

  function renderSkeleton() {
    if (activeTab === 'followers' || activeTab === 'following') {
      return (
        <div className="space-y-4 px-4 py-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4 px-4 py-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="rounded-card border border-outline p-4 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap border-b border-outline bg-background/50 px-1">
        {TAB_CONFIG.map((tab) => renderTabButton(tab))}
        {isOwnProfile && renderTabButton({ key: 'flags', label: 'Reports', icon: Flag })}
      </div>

      {error ? (
        <div className="rounded-card border border-error/20 bg-error/5 p-4 mt-4 text-sm text-error">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => loadTabContent(activeTab)}
            className="mt-3 text-primary underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="divide-y divide-outline mt-4">
        {isTabLoading && showSkeleton ? renderSkeleton() : renderTabContent()}
      </div>
    </div>
  );
}
