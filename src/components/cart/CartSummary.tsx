'use client';

interface CartSummaryProps {
  total: number;
  isGuest: boolean;
  onCheckout: () => void;
}

export default function CartSummary({
  total,
  isGuest,
  onCheckout,
}: CartSummaryProps) {
  return (
    <aside
      className="
        sticky
        top-28
        rounded-3xl
        bg-white
        p-8
        shadow-sm
      "
    >
      <h2 className="text-2xl font-bold">
        Order Summary
      </h2>

      <div className="mt-8 space-y-4">

        <div className="flex items-center justify-between">

          <span className="text-gray-500">
            Subtotal
          </span>

          <span className="font-semibold">
            KES {total.toLocaleString()}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-gray-500">
            Delivery
          </span>

          <span className="font-semibold text-green-600">
            Calculated at Checkout
          </span>

        </div>

        <div className="border-t pt-5">

          <div className="flex items-center justify-between">

            <span className="text-lg font-semibold">
              Total
            </span>

            <span className="text-3xl font-black">
              KES {total.toLocaleString()}
            </span>

          </div>

        </div>

      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="
          mt-8
          w-full
          rounded-full
          bg-rexo-teal
          py-4
          font-semibold
          text-white
          transition
          hover:bg-rexo-teal-dark
        "
      >
        {isGuest
          ? 'Continue as Guest'
          : 'Proceed to Checkout'}
      </button>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="
          mt-3
          w-full
          rounded-full
          border
          border-gray-300
          py-4
          font-semibold
          transition
          hover:bg-gray-50
        "
      >
        Continue Shopping
      </button>

      <div
        className="
          mt-8
          rounded-2xl
          bg-rexo-teal/5
          p-4
          text-sm
          text-gray-600
        "
      >
        🚚 Shipping fees and taxes will be calculated during checkout.
      </div>
    </aside>
  );
}