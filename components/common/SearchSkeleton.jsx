import Skeleton from './Skeleton';

export default function SearchSkeleton() {
  return (
    <div className="space-y-6 px-4 py-4">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-full rounded-button" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((key) => (
          <div key={key} className="rounded-card border border-outline p-4 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
