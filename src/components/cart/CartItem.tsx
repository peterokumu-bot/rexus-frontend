'use client';

import { Minus, Plus } from 'lucide-react';

interface CartItemProps {
  item: any;
  isGuest: boolean;
  onUpdateQuantity: (
    id: string,
    quantity: number,
  ) => void;
}

export default function CartItem({
  item,
  isGuest,
  onUpdateQuantity,
}: CartItemProps) {
  if (!item?.product) return null;

  const id = isGuest
    ? item.productId || item.id
    : item.id;

  const subtotal =
    Number(item.product.price) *
    Number(item.quantity);

  return (
    <article
      className="
        flex
        items-center
        justify-between
        gap-6
        rounded-3xl
        bg-white
        p-5
        transition
        hover:shadow-md
      "
    >
      {/* Left */}

      <div className="flex items-center gap-5">

        <img
          src={
            item.product.imageUrl ||
            '/placeholder.png'
          }
          alt={item.product.name}
          className="
            h-24
            w-24
            rounded-2xl
            object-cover
          "
        />

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >
            {item.product.name}
          </h2>

          <p className="mt-1 text-gray-500">
            KES{' '}
            {Number(
              item.product.price,
            ).toLocaleString()}
          </p>

          <div className="mt-4 flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(
                  id,
                  item.quantity - 1,
                )
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                transition
                hover:bg-gray-100
              "
            >
              <Minus size={16} />
            </button>

            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(
                  id,
                  item.quantity + 1,
                )
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-rexo-teal
                text-white
                transition
                hover:bg-rexo-teal-dark
              "
            >
              <Plus size={16} />
            </button>

          </div>

        </div>

      </div>

      {/* Right */}

      <div className="text-right">

        <p className="text-sm text-gray-500">
          Subtotal
        </p>

        <p
          className="
            text-xl
            font-bold
          "
        >
          KES{' '}
          {subtotal.toLocaleString()}
        </p>

      </div>

    </article>
  );
}