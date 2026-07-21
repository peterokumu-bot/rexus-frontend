'use client';

import { Eye, Heart } from 'lucide-react';

interface ProductActionsProps {
  onWishlist?: () => void;
  onQuickView?: () => void;
}

export default function ProductActions({
  onWishlist,
  onQuickView,
}: ProductActionsProps) {
  return (
    <div
      className="
        absolute
        right-2
        top-2
        z-30
        flex
        flex-col
        gap-1.5
        opacity-0
        transition-all
        duration-200
        group-hover:opacity-100
        md:opacity-0
      "
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onWishlist?.();
        }}
        aria-label="Add to Wishlist"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-white
          text-gray-600
          transition-all
          hover:bg-rexo-pink
          hover:text-white
        "
      >
        <Heart size={15} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onQuickView?.();
        }}
        aria-label="Quick View"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-white
          text-gray-600
          transition-all
          hover:bg-rexo-teal
          hover:text-white
        "
      >
        <Eye size={15} />
      </button>
    </div>
  );
}