import { cn } from "@/lib/utils";

export function ProgramCardSkeleton() {
  return (
    <div className="bg-vd-card-surface rounded-2xl overflow-hidden border border-vd-border-soft">
      {/* Image skeleton */}
      <div className="relative aspect-16/10 bg-vd-skeleton animate-pulse">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title and rating row */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-3/4 bg-vd-skeleton rounded-md animate-pulse" />
            <div className="h-3 w-1/2 bg-vd-skeleton rounded-md animate-pulse" />
          </div>
          <div className="h-5 w-12 bg-vd-skeleton rounded-md animate-pulse" />
        </div>
        
        {/* Location skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-vd-skeleton rounded-full animate-pulse" />
          <div className="h-3 w-1/3 bg-vd-skeleton rounded-md animate-pulse" />
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 w-full bg-vd-skeleton rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export function ProgramListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="px-4 space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProgramCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DayFilterSkeleton() {
  // Reproduit la géométrie réelle du DayFilter : 3 segments joints
  return (
    <div className="px-4 py-3">
      <div className="flex items-center overflow-hidden rounded-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "min-h-11 w-28 animate-pulse bg-vd-skeleton",
              i === 0 && "rounded-l-full",
              i === 2 && "rounded-r-full",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="px-4 pt-6 pb-2">
      <div className="flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-vd-skeleton animate-pulse" />
          <div className="h-7 w-20 bg-vd-skeleton rounded-md animate-pulse" />
        </div>
        
        {/* Weather widget */}
        <div className="h-9 w-24 rounded-full bg-vd-skeleton animate-pulse" />
      </div>
    </header>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-vd-page-bg">
      <HeaderSkeleton />
      <DayFilterSkeleton />
      <div className="py-2">
        <ProgramListSkeleton count={3} />
      </div>
    </div>
  );
}
