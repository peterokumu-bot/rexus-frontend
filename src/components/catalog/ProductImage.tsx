'use client';

import Image from 'next/image';

interface ProductImageProps {
  imageUrl?: string |null;
  name: string;
  featured?: boolean;
}

export default function ProductImage({
  imageUrl,
  name,
}: ProductImageProps) {
  return (
    <div
      className="
        relative
        flex
        h-48
        w-full
        items-center
        justify-center
        overflow-hidden
      "
    >
      <Image
        src={imageUrl || '/placeholder.png'}
        alt={name}
        fill
        sizes="
          (max-width:640px) 50vw,
          (max-width:1024px) 33vw,
          16vw
        "
        className="
          object-contain
          transition-transform
          duration-300
          ease-out
          group-hover:scale-105
        "
        priority={false}
      />
    </div>
  );
}