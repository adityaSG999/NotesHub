import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

async function calculateTrendingTopics() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Try to get data from last 7 days first
  let notes = await prisma.note.findMany({
    where: {
      status: 'PUBLISHED',
      createdAt: { gte: sevenDaysAgo },
      category: { not: '' },
    },
    include: {
      likes: true,
      bookmarks: true,
    },
  });

  let timePeriod = '7d';

  // If not enough data (less than 5 categories), fallback to 30 days
  const uniqueCategories = new Set(notes.map((n) => n.category));
  if (uniqueCategories.size < 5) {
    notes = await prisma.note.findMany({
      where: {
        status: 'PUBLISHED',
        createdAt: { gte: thirtyDaysAgo },
        category: { not: '' },
      },
      include: {
        likes: true,
        bookmarks: true,
      },
    });
    timePeriod = '30d';
  }

  // Group by category and calculate metrics
  const categoryStats = {};

  notes.forEach((note) => {
    const category = note.category;
    if (!category) return;

    if (!categoryStats[category]) {
      categoryStats[category] = {
        noteCount: 0,
        likesCount: 0,
        bookmarksCount: 0,
      };
    }

    categoryStats[category].noteCount += 1;
    categoryStats[category].likesCount += note.likes.length;
    categoryStats[category].bookmarksCount += note.bookmarks.length;
  });

  // Calculate trending scores and prepare data
  const trendingData = Object.entries(categoryStats).map(([category, stats]) => {
    const trendingScore = stats.noteCount * 1 + stats.likesCount * 3 + stats.bookmarksCount * 5;
    return {
      category,
      noteCount: stats.noteCount,
      likesCount: stats.likesCount,
      bookmarksCount: stats.bookmarksCount,
      trendingScore,
      timePeriod,
    };
  });

  // Sort by trending score
  trendingData.sort((a, b) => b.trendingScore - a.trendingScore);

  // Clear old trending topics
  await prisma.trendingTopic.deleteMany({});

  // Insert new trending topics
  for (const data of trendingData) {
    await prisma.trendingTopic.create({
      data,
    });
  }

  return {
    count: trendingData.length,
    timePeriod,
    topTopics: trendingData.slice(0, 10),
  };
}

// POST /api/admin/trending - Manually refresh trending topics (admin only)
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const result = await calculateTrendingTopics();

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed ${result.count} trending topics`,
      ...result,
    });
  } catch (error) {
    console.error('Error refreshing trending topics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to refresh trending topics' },
      { status: 500 }
    );
  }
}
