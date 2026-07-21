'use client';

interface GuestCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onGuestCheckout: () => void;
}

export default function GuestCheckoutModal({
  open,
  onClose,
  onLogin,
  onRegister,
  onGuestCheckout,
}: GuestCheckoutModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          bg-white
          p-8
        "
      >
        <h2 className="text-2xl font-bold">
          Continue Checkout
        </h2>

        <p className="mt-3 text-gray-500">
          You can continue as a guest or sign in to
          save your orders and delivery addresses.
        </p>

        <div className="mt-8 space-y-3">

          <button
            type="button"
            onClick={onLogin}
            className="
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
            Login
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="
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
            Create Account
          </button>

          <button
            type="button"
            onClick={onGuestCheckout}
            className="
              w-full
              rounded-full
              bg-rexo-gold
              py-4
              font-semibold
              text-white
              transition
              hover:opacity-90
            "
          >
            Continue as Guest
          </button>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            mt-6
            w-full
            text-center
            text-sm
            text-gray-500
            hover:text-black
          "
        >
          Cancel
        </button>

      </div>
    </div>
  );
}