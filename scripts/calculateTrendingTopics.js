const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function calculateTrendingTopics() {
  console.log('Calculating trending topics...');

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
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
      console.log('Not enough data in 7 days, falling back to 30 days...');
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

    console.log(`Successfully calculated ${trendingData.length} trending topics`);
    console.log('Top 10 trending topics:');
    trendingData.slice(0, 10).forEach((topic, index) => {
      console.log(
        `${index + 1}. #${topic.category} (score: ${topic.trendingScore}, notes: ${topic.noteCount}, likes: ${topic.likesCount}, bookmarks: ${topic.bookmarksCount})`
      );
    });
  } catch (error) {
    console.error('Error calculating trending topics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

calculateTrendingTopics();
