import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import HomeFeed from '@/components/features/HomeFeed';
import FeedSkeleton from '@/components/common/FeedSkeleton';
import LandingPage from '@/components/features/LandingPage';

function normalizeNoteForCard(note, currentUserId) {
  const hasLiked = note.likes.some((like) => like.userId === currentUserId);
  const hasBookmarked = note.bookmarks.some((bookmark) => bookmark.userId === currentUserId);
  const userFlagStatus = note.flags.find((flag) => flag.reporterId === currentUserId)?.status || null;

  const { likes, bookmarks, flags, ...rest } = note;

  return {
    ...rest,
    hasLiked,
    hasBookmarked,
    userFlagStatus,
  };
}

async function getNotes(currentUserId) {
  try {
    const limit = 20;
    const notes = await prisma.note.findMany({
      where: { status: 'PUBLISHED' },
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true }
        },
        likes: {
          where: { userId: currentUserId },
          select: { userId: true }
        },
        bookmarks: {
          where: { userId: currentUserId },
          select: { userId: true }
        },
        flags: {
          where: { reporterId: currentUserId },
          select: { reporterId: true, status: true }
        }
      }
    });

    let nextCursor = null;
    if (notes.length > limit) {
      const nextItem = notes.pop();
      nextCursor = nextItem.id;
    }

    return {
      notes: notes.map((note) => normalizeNoteForCard(note, currentUserId)),
      nextCursor,
    };
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return { notes: [], nextCursor: null };
  }
}

export const metadata = {
  title: 'Home | NotesHub',
  description: 'Your personal text-based microblogging feed on NotesHub. Share thoughts, follow creators, and discover content.',
  keywords: 'microblog, notes, feed, social, content sharing',
  openGraph: {
    title: 'NotesHub - Your Personal Feed',
    description: 'Your personal text-based microblogging feed on NotesHub.',
    type: 'website',
  },
};

async function HomeFeedSection({ currentUser }) {
  const { notes, nextCursor } = await getNotes(currentUser.id);

  return <HomeFeed initialNotes={notes} initialNextCursor={nextCursor} currentUser={currentUser} />;
}

export default async function HomePage() {
  // Read the session cookie to identify the logged-in user
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? verifyToken(token) : null;

  // Show landing page for unauthenticated users
  if (!session) {
    return <LandingPage />;
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, username: true, email: true, avatarUrl: true, role: true }
  });

  if (!currentUser) {
    return <LandingPage />;
  }

  return (
    <div>
      {/* Page Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-outline z-40 px-4 py-4">
        <h1 className="text-xl font-bold text-text-primary">Home</h1>
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <HomeFeedSection currentUser={currentUser} />
      </Suspense>
    </div>
  );
}
