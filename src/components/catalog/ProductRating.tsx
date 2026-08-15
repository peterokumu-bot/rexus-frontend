'use client';

import { Star } from 'lucide-react';

interface ProductRatingProps {
  rating?: number | null;
  reviews?: number | null;
}

export default function ProductRating({
  rating,
  reviews,
}: ProductRatingProps) {
  const safeRating = rating ?? 0;
  const safeReviews = reviews ?? 0;

  return (
    <div className="mt-3 flex items-center gap-2">
      <Star size={16} className="fill-rexo-gold text-rexo-gold" />

      <span className="text-sm font-semibold text-gray-800">
        {safeRating.toFixed(1)}
      </span>

      <span className="text-sm text-gray-400">
        ({safeReviews})
      </span>
    </div>
  );
}