import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import BookmarkList from '@/components/features/BookmarkList';
import { Bookmark } from 'lucide-react';

async function getBookmarks(userId) {
  return prisma.bookmark.findMany({
    where: { userId },
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: {
      note: {
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          likes: {
            where: { userId },
            select: { userId: true },
          },
          bookmarks: {
            where: { userId },
            select: { userId: true },
          },
          flags: {
            where: { reporterId: userId },
            select: { reporterId: true, status: true },
          },
        }
      }
    }
  });
}

export const metadata = {
  title: 'Bookmarks | NotesHub',
  description: 'Your saved notes on NotesHub. Access your bookmarked content and never lose your favorite posts.',
  keywords: 'bookmarks, saved notes, favorites, collections',
  openGraph: {
    title: 'NotesHub - Your Bookmarks',
    description: 'Your saved notes on NotesHub.',
    type: 'website',
  },
};

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? verifyToken(token) : null;

  if (!session) {
    return (
      <div>
        <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-outline z-40 px-4 py-4">
          <h1 className="text-xl font-bold text-text-primary">Bookmarks</h1>
        </div>
        <div className="p-8 text-center text-text-muted">
          Please sign in to view your bookmarks.
        </div>
      </div>
    );
  }

  const bookmarks = await getBookmarks(session.id);
  const normalizedBookmarks = bookmarks.map(({ note }) => ({
    ...note,
    hasBookmarked: true,
    hasLiked: Boolean(note.likes?.length),
    userFlagStatus: note.flags?.[0]?.status || null,
  }));

  return (
    <div>
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-outline z-40 px-4 py-4">
        <h1 className="text-xl font-bold text-text-primary">Bookmarks</h1>
        <p className="text-xs text-text-muted">{normalizedBookmarks.length} saved notes</p>
      </div>

      <BookmarkList initialBookmarks={normalizedBookmarks} currentUser={session} />
    </div>
  );
}
