import Skeleton from './Skeleton';

export default function ProfileSkeleton() {
  return (
    <div>
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-outline z-40 px-4 py-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24 mt-3" />
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="rounded-card border border-outline p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((idx) => (
              <Skeleton key={idx} className="h-16" />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((idx) => (
            <Skeleton key={idx} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="rounded-card border border-outline p-4 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
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
      </div>
    </div>
  );
}
