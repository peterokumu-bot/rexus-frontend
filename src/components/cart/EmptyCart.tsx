'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function EmptyCart() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        bg-white
        py-24
      "
    >
      <ShoppingBag
        size={70}
        className="text-rexo-teal"
      />

      <h2 className="mt-6 text-3xl font-bold">
        Your cart is empty
      </h2>

      <p className="mt-3 text-gray-500">
        Looks like you haven't added any gifts yet.
      </p>

      <Link
        href="/"
        className="
          mt-8
          rounded-full
          bg-rexo-teal
          px-8
          py-4
          font-semibold
          text-white
          transition
          hover:bg-rexo-teal-dark
        "
      >
        Continue Shopping
      </Link>
    </div>
  );
}