import Skeleton from './Skeleton';

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((key) => (
          <Skeleton key={key} className="h-32 rounded-card" />
        ))}
      </div>

      <div className="bg-surface border border-outline rounded-card p-6 shadow-soft">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((key) => (
            <Skeleton key={key} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
