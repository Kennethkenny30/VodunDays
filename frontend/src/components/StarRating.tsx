"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={cn(
              "transition-transform duration-100 focus:outline-none",
              hovered >= star ? "scale-125" : "scale-100"
            )}
            aria-label={`${star} étoile${star > 1 ? "s" : ""} sur 5`}
          >
            <Star
              className="size-7 select-none transition-colors duration-150"
              fill={isFilled ? "#F56E0F" : "none"}
              style={{
                color: isFilled ? "#F56E0F" : "#878787",
                filter: isFilled
                  ? "drop-shadow(0 0 6px rgba(245, 110, 15, 0.5))"
                  : "none",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
