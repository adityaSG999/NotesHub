import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { profileTabSchema } from '@/lib/validation';

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

export async function GET(request, { params }) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'notes';
    const parsedTab = profileTabSchema.safeParse(tab);
    if (!parsedTab.success) {
      return NextResponse.json({ success: false, message: 'Invalid profile tab' }, { status: 400 });
    }
    const activeTab = parsedTab.data;
    const token = request.cookies.get('token')?.value;
    const payload = token ? verifyToken(token) : null;
    const currentUserId = payload?.id || null;

    const profileUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (!profileUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    let data = [];

    if (activeTab === 'likes') {
      data = await getUserLikes(profileUser.id, currentUserId);
    } else if (activeTab === 'followers') {
      data = await getUserFollowers(profileUser.id);
    } else if (activeTab === 'following') {
      data = await getUserFollowing(profileUser.id);
    } else if (activeTab === 'flags') {
      data = await getUserFlags(profileUser.id);
    } else {
      data = await getUserNotes(profileUser.id, currentUserId);
    }

    return NextResponse.json({ success: true, tab: activeTab, data });
  } catch (error) {
    console.error('Profile tab API error:', error);
    return NextResponse.json({ success: false, message: 'Could not load profile content.' }, { status: 500 });
  }
}
