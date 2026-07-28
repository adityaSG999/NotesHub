import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ProfileInfo from '@/components/features/ProfileInfo';
import ProfileTabs from '@/components/features/ProfileTabs';

async function getUserProfile(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true, username: true, avatarUrl: true, bio: true,
      createdAt: true,
    }
  });

  if (!user) return null;

  const [followersCount, followingCount, notesCount, likesCount, flagsCount] = await Promise.all([
    prisma.follower.count({ where: { followingId: user.id } }),
    prisma.follower.count({ where: { followerId: user.id } }),
    prisma.note.count({ where: { authorId: user.id, status: 'PUBLISHED' } }),
    prisma.like.count({ where: { userId: user.id } }),
    prisma.flag.count({ where: { reporterId: user.id } }),
  ]);

  return {
    ...user,
    _count: {
      notes: notesCount,
      followers: followersCount,
      following: followingCount,
      likes: likesCount,
      flags: flagsCount,
    }
  };
}

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

async function getUserNotes(userId, currentUserId) {
  const notes = await prisma.note.findMany({
    where: { authorId: userId, status: 'PUBLISHED' },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true, avatarUrl: true } },
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

  return notes.map((note) => normalizeNoteForCard(note, currentUserId));
}

async function getUserLikes(userId, currentUserId) {
  const likes = await prisma.like.findMany({
    where: { userId },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      note: {
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
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
      }
    }
  });

  return likes.map((like) => ({ ...like, note: normalizeNoteForCard(like.note, currentUserId) }));
}

async function getUserFlags(userId) {
  return prisma.flag.findMany({
    where: { reporterId: userId },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      note: {
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } }
        }
      }
    }
  });
}

async function getUserFollowers(userId) {
  return prisma.follower.findMany({
    where: { followingId: userId },
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      follower: { select: { id: true, username: true, avatarUrl: true } }
    }
  });
}

async function getUserFollowing(userId) {
  return prisma.follower.findMany({
    where: { followerId: userId },
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      following: { select: { id: true, username: true, avatarUrl: true } }
    }
  });
}

async function getIsFollowing(followerId, followingId) {
  if (!followerId || followerId === followingId) return false;
  const record = await prisma.follower.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  });
  return !!record;
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `@${username} | NotesHub`,
    description: `View ${username}'s profile, notes, and activity on NotesHub. Follow to see their latest content.`,
    keywords: `profile, ${username}, user, notes, social`,
    openGraph: {
      title: `@${username} on NotesHub`,
      description: `View ${username}'s profile and notes on NotesHub.`,
      type: 'profile',
    },
  };
}

export default async function ProfilePage({ params, searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) redirect('/login');

  const { username } = await params;
  const profileUser = await getUserProfile(username);

  if (!profileUser) {
    notFound();
  }

  const isOwnProfile = session.id === profileUser.id;
  const tab = (await searchParams).tab || 'notes';
  const [notes, isFollowing, likes, followers, following, flags] = await Promise.all([
    getUserNotes(profileUser.id, session.id),
    getIsFollowing(session.id, profileUser.id),
    tab === 'likes' ? getUserLikes(profileUser.id, session.id) : undefined,
    tab === 'followers' ? getUserFollowers(profileUser.id) : undefined,
    tab === 'following' ? getUserFollowing(profileUser.id) : undefined,
    isOwnProfile && tab === 'flags' ? getUserFlags(profileUser.id) : undefined,
  ]);

  return (
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-outline z-40 px-4 py-4">
        <h1 className="text-xl font-bold text-text-primary">@{profileUser.username}</h1>
        <p className="text-xs text-text-muted">{profileUser._count.notes} notes</p>
      </div>

      {/* Profile Info */}
      <ProfileInfo
        profileUser={profileUser}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
      />

      <ProfileTabs
        profileUser={profileUser}
        currentUser={session}
        currentUserId={session.id}
        isOwnProfile={isOwnProfile}
        initialTab={tab}
        initialNotes={notes}
        initialLikes={likes}
        initialFollowers={followers}
        initialFollowing={following}
        initialFlags={flags}
      />
    </div>
  );
}
