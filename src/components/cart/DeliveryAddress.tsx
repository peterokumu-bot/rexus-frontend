'use client';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  county: string;
  town: string;
  isDefault?: boolean;
}

interface DeliveryAddressProps {
  addresses: Address[];
  selectedAddress: string;
  onSelect: (id: string) => void;
  onAddAddress: () => void;
}

export default function DeliveryAddress({
  addresses,
  selectedAddress,
  onSelect,
  onAddAddress,
}: DeliveryAddressProps) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Delivery Address
        </h2>

        <button
          type="button"
          onClick={onAddAddress}
          className="
            rounded-full
            border
            border-rexo-teal
            px-5
            py-2
            text-sm
            font-semibold
            text-rexo-teal
            transition
            hover:bg-rexo-teal
            hover:text-white
          "
        >
          + Add Address
        </button>

      </div>

      {addresses.length === 0 && (

        <div className="py-10 text-center">

          <p className="text-gray-500">
            You haven't added any delivery addresses yet.
          </p>

        </div>

      )}

      <div className="space-y-4">

        {addresses.map((address) => (

          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address.id)}
            className={`
              w-full
              rounded-2xl
              border
              p-5
              text-left
              transition-all
              ${
                selectedAddress === address.id
                  ? 'border-rexo-teal bg-rexo-teal/5'
                  : 'border-gray-200 hover:border-rexo-teal/50'
              }
            `}
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  {address.fullName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {address.phone}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {address.county}, {address.town}
                </p>

              </div>

              {address.isDefault && (
                <span
                  className="
                    rounded-full
                    bg-rexo-teal
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  Default
                </span>
              )}

            </div>

          </button>

        ))}

      </div>

    </section>
  );
}