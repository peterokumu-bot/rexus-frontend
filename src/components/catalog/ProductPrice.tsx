'use client';

interface ProductPriceProps {
  price: number;
  discountPrice?: number | null;
  currency?: string;
}

export default function ProductPrice({
  price,
  discountPrice,
  currency = 'KES',
}: ProductPriceProps) {
  const finalPrice = discountPrice ?? price;

  const formatter = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const hasDiscount =
    discountPrice !== undefined &&
    discountPrice !== null &&
    discountPrice < price;

  return (
    <div className="mt-1">

      <div className="flex items-center gap-2 flex-wrap">

        <span
          className="
            text-[16px]
            font-bold
            leading-none
            text-gray-900
          "
        >
          {currency} {formatter.format(finalPrice)}
        </span>

        {hasDiscount && (
          <span
            className="
              text-[12px]
              text-gray-400
              line-through
              leading-none
            "
          >
            {currency} {formatter.format(price)}
          </span>
        )}

      </div>

    </div>
  );
}