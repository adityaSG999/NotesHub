import Skeleton from './Skeleton';

export default function AdminUsersSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="bg-surface border border-outline rounded-card shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-outline">
          <Skeleton className="h-5 w-44" />
        </div>
        <div className="space-y-3 p-6">
          {[1, 2, 3, 4, 5].map((key) => (
            <div key={key} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center animate-pulse">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
