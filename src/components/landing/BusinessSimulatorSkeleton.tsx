import { Skeleton } from '@/components/ui/skeleton';

const BusinessSimulatorSkeleton = () => {
  return (
    <div className="mt-8 animate-fade-in">
      <div className="glass-card p-6 md:p-8">
        {/* Tabs skeleton */}
        <div className="w-full grid grid-cols-3 bg-secondary/30 rounded-xl p-1 mb-6">
          <Skeleton className="h-9 rounded-lg" />
          <Skeleton className="h-9 rounded-lg" />
          <Skeleton className="h-9 rounded-lg" />
        </div>

        {/* Business name skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Content cards skeleton */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Packages card */}
          <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          {/* Loops card */}
          <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 space-y-3">
            <Skeleton className="h-5 w-28" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        {/* Timeline skeleton */}
        <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="relative">
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        {/* Action button skeleton */}
        <div className="flex justify-center mt-6">
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default BusinessSimulatorSkeleton;
