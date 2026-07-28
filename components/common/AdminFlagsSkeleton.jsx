import Skeleton from './Skeleton';

export default function AdminFlagsSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-10 w-28 rounded-full" />
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((key) => (
          <div key={key} className="rounded-card border border-outline p-4 shadow-soft">
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
