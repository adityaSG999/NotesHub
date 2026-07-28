import Skeleton from './Skeleton';

export default function FeedSkeleton() {
  return (
    <div className="divide-y divide-outline">
      <div className="px-4 py-4">
        <Skeleton className="h-36" />
      </div>

      <div className="flex flex-col divide-y divide-outline">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-5/12" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
