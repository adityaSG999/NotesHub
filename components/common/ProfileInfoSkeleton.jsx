import Skeleton from './Skeleton';

export default function ProfileInfoSkeleton() {
  return (
    <div className="bg-surface border border-outline rounded-card p-6 shadow-soft animate-pulse">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((idx) => (
          <Skeleton key={idx} className="h-16" />
        ))}
      </div>
    </div>
  );
}
