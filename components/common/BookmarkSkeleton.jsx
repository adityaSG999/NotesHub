import Skeleton from './Skeleton';

export default function BookmarkSkeleton() {
  return (
    <div className="space-y-4 px-4 py-4">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="rounded-card border border-outline p-4 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}
