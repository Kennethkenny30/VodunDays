"use client";

import { cn } from "@/lib/utils";

export function CultureCardSkeleton() {
  return (
    <div className="bg-[#1B1B1E] rounded-[20px] overflow-hidden border border-white/6">
      {/* Image skeleton */}
      <div className="relative aspect-[16/10] bg-[#262626] animate-pulse">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Tags row */}
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-[#262626] rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-[#262626] rounded-full animate-pulse" />
        </div>
        
        {/* Title skeleton */}
        <div className="h-5 w-3/4 bg-[#262626] rounded-md animate-pulse" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#262626] rounded-md animate-pulse" />
          <div className="h-3 w-5/6 bg-[#262626] rounded-md animate-pulse" />
          <div className="h-3 w-2/3 bg-[#262626] rounded-md animate-pulse" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-2 pt-1">
          <div className="flex-1 h-9 bg-[#262626] rounded-lg animate-pulse" />
          <div className="w-11 h-9 bg-[#262626] rounded-lg animate-pulse" />
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
