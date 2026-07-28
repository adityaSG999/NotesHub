import prisma from '@/lib/prisma';

export default async function sitemap() {
  const baseUrl = 'https://noteshub-beryl.vercel.app';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic pages - published notes
  let notes = [];
  try {
    notes = await prisma.note.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, updatedAt: true },
      take: 1000, // Limit to 1000 notes for performance
    });
  } catch (error) {
    console.error('Failed to fetch notes for sitemap:', error);
  }

  const notePages = notes.map((note) => ({
    url: `${baseUrl}/notes/${note.id}`,
    lastModified: note.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic pages - user profiles
  let users = [];
  try {
    users = await prisma.user.findMany({
      where: { status: 'ACTIVE' },
      select: { username: true, updatedAt: true },
      take: 1000, // Limit to 1000 users for performance
    });
  } catch (error) {
    console.error('Failed to fetch users for sitemap:', error);
  }

  const profilePages = users.map((user) => ({
    url: `${baseUrl}/profile/${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...notePages, ...profilePages];
}
