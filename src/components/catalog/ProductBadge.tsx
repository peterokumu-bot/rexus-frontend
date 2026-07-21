'use client';

interface ProductBadgeProps {
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  discountPercent?: number;
}

export default function ProductBadge({
  featured,
 bestseller,
  newArrival,
  discountPercent,
}: ProductBadgeProps) {
  return (
    <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">

      {discountPercent ? (
        <span
          className="
            rounded
            bg-red-500
            px-1.5
            py-0.5
            text-[10px]
            font-bold
            uppercase
            text-white
          "
        >
          -{discountPercent}%
        </span>
      ) : null}

      {newArrival && (
        <span
          className="
            rounded
            bg-rexo-pink
            px-1.5
            py-0.5
            text-[10px]
            font-semibold
            uppercase
            text-white
          "
        >
          NEW
        </span>
      )}

      {bestseller && (
        <span
          className="
            rounded
            bg-rexo-gold
            px-1.5
            py-0.5
            text-[10px]
            font-semibold
            uppercase
            text-white
          "
        >
          HOT
        </span>
      )}

      {featured && (
        <span
          className="
            rounded
            bg-rexo-teal
            px-1.5
            py-0.5
            text-[10px]
            font-semibold
            uppercase
            text-white
          "
        >
          TOP
        </span>
      )}

    </div>
  );
}