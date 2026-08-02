import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Users, FileText, Flag, TrendingUp } from 'lucide-react';
import TrendingRefreshButton from '@/components/features/TrendingRefreshButton';

async function getStats() {
  const [totalUsers, totalNotes, pendingFlags, publishedToday] = await Promise.all([
    prisma.user.count(),
    prisma.note.count({ where: { status: 'PUBLISHED' } }),
    prisma.flag.count({ where: { status: 'PENDING' } }),
    prisma.note.count({
      where: {
        status: 'PUBLISHED',
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
  ]);
  return { totalUsers, totalNotes, pendingFlags, publishedToday };
}

async function getRecentNotes() {
  return prisma.note.findMany({
    where: { status: 'PUBLISHED' },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { username: true } } }
  });
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? verifyToken(token) : null;

  const stats = await getStats();
  const recentNotes = await getRecentNotes();

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'text-primary bg-primary/10' },
    { label: 'Published Notes', value: stats.totalNotes, icon: <FileText className="w-6 h-6" />, color: 'text-secondary bg-secondary/10' },
    { label: 'Pending Flags', value: stats.pendingFlags, icon: <Flag className="w-6 h-6" />, color: 'text-error bg-error/10' },
    { label: 'Notes Today', value: stats.publishedToday, icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-600 bg-green-100 dark:bg-green-900/20' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-muted mt-1">Platform overview and quick stats.</p>
        </div>
        <TrendingRefreshButton />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-surface border border-outline rounded-card p-5 shadow-soft flex items-center gap-4">
            <div className={`rounded-xl p-3 shrink-0 ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-3xl font-extrabold text-text-primary">{card.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Notes Table */}
      <div className="bg-surface border border-outline rounded-card shadow-soft">
        <div className="px-6 py-4 border-b border-outline">
          <h2 className="font-bold text-text-primary">Recent Notes</h2>
        </div>
        <div className="divide-y divide-outline">
          {recentNotes.map((note) => (
            <div key={note.id} className="px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {note.title || note.content.substring(0, 60) + '...'}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  by @{note.author.username} &middot; {note.category}
                </p>
              </div>
              <span className="text-xs text-text-muted shrink-0">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
