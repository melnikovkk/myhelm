import { Skeleton } from '@/components/ui/skeleton';

const PromptGeneratorSkeleton = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Progress dots skeleton */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((dot) => (
          <Skeleton key={dot} className="w-2 h-2 rounded-full" />
        ))}
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-4 w-48 mx-auto" />

      {/* Mode cards skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="py-5 px-4 flex flex-col items-center gap-3 rounded-xl border border-border/30 bg-secondary/20">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="py-5 px-4 flex flex-col items-center gap-3 rounded-xl border border-border/30 bg-secondary/20">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Divider skeleton */}
      <div className="relative flex items-center justify-center mt-6">
        <Skeleton className="absolute inset-x-0 h-px" />
        <Skeleton className="relative h-4 w-8 rounded" />
      </div>

      {/* Demo example button skeleton */}
      <Skeleton className="w-full h-10 rounded-lg" />
    </div>
  );
};

export default PromptGeneratorSkeleton;
