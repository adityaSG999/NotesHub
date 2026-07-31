import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const trendingTopics = await prisma.trendingTopic.findMany({
      orderBy: { trendingScore: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      topics: trendingTopics,
    });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return NextResponse.json(
      { success: false, topics: [], message: 'Failed to fetch trending topics' },
      { status: 500 }
    );
  }
}
