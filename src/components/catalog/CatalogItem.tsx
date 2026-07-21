'use client';

import Link from 'next/link';

import { Product } from '@/types/product';

import ProductActions from './ProductActions';
import ProductBadge from './ProductBadge';
import ProductImage from './ProductImage';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';

interface CatalogItemProps {
  product: Product;
  onWishlist?: () => void;
  onQuickView?: () => void;
}

export default function CatalogItem({
  product,
  onWishlist,
  onQuickView,
}: CatalogItemProps) {
  const discountPercent =
    product.discountPrice &&
    product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) /
            product.price) *
            100,
        )
      : undefined;

  return (
    <article
      className="
        group
        relative
        flex
        flex-col
        select-none
      "
    >
      {/* Marketing Badges */}

      <ProductBadge
        featured={product.isFeatured}
        bestseller={product.isBestSeller}
        newArrival={product.isNewArrival}
        discountPercent={discountPercent}
      />

      {/* Wishlist & Quick View */}

      <ProductActions
        onWishlist={onWishlist}
        onQuickView={onQuickView}
      />

      {/* Product */}

      <Link
        href={`/product/${product.slug}`}
        className="flex flex-col"
      >
        <ProductImage
          imageUrl={product.imageUrl}
          name={product.name}
          featured={product.isFeatured}
        />

        <div className="mt-1 space-y-1">

          <ProductRating
            rating={product.averageRating}
            reviews={product.reviewCount}
          />

          <h3
            className="
              line-clamp-2
              min-h-[34px]
              text-[14px]
              font-medium
              leading-4
              text-gray-900
              transition-colors
              duration-200
              group-hover:text-rexo-teal
            "
          >
            {product.name}
          </h3>

          <ProductPrice
            price={product.price}
            discountPrice={product.discountPrice}
          />

        </div>

      </Link>

    </article>
  );
}