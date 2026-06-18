"use client";

import { cn } from "@/lib/utils";

export function CultureCardSkeleton() {
  return (
    <div className="bg-vd-card-surface rounded-[20px] overflow-hidden border border-vd-border-soft">
      <div className="relative aspect-16/10 bg-vd-skeleton animate-pulse" />

      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-vd-skeleton rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-vd-skeleton rounded-full animate-pulse" />
        </div>

        <div className="h-5 w-3/4 bg-vd-skeleton rounded-md animate-pulse" />

        <div className="space-y-2">
          <div className="h-3 w-full bg-vd-skeleton rounded-md animate-pulse" />
          <div className="h-3 w-5/6 bg-vd-skeleton rounded-md animate-pulse" />
          <div className="h-3 w-2/3 bg-vd-skeleton rounded-md animate-pulse" />
        </div>

        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 bg-vd-skeleton rounded-lg animate-pulse" />
          <div className="w-11 h-9 bg-vd-skeleton rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CultureListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="px-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <CultureCardSkeleton key={i} />
      ))}
    </div>
  );
}
