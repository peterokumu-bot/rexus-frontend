'use client';

import { Star } from 'lucide-react';

interface ProductRatingProps {
  rating?: number | null;
  reviews?: number | null;
}

export default function ProductRating({
  rating = 0,
  reviews = 0,
}: ProductRatingProps) {
  return (
    <div className="mt-3 flex items-center gap-2">

      <Star
        size={16}
        className="fill-rexo-gold text-rexo-gold"
      />

      <span className="text-sm font-semibold text-gray-800">
        {rating.toFixed(1)}
      </span>

      <span className="text-sm text-gray-400">
        ({reviews})
      </span>

    </div>
  );
}