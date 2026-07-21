'use client';

import Link from 'next/link';

import {
  Phone,
  Truck,
  Headphones,
  Globe,
  Heart,
  ShoppingCart,
  User,
  MapPinned,
  ChevronDown,
} from 'lucide-react';

export default function UtilityNavbar() {
  return (
    <div className="w-full bg-[#103534] text-white">

      <div className="mx-auto flex h-11 max-w-[1800px] items-center justify-between px-6">

        {/* Left */}

        <div className="flex items-center gap-8 text-sm">

          <div className="flex items-center gap-2">
            <Phone size={15} />
            <span>+254 704 63 4949</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Truck size={15} />
            <span>Free Delivery above KES 10,000</span>
          </div>

          <div className="hidden xl:flex items-center gap-2">
            <Headphones size={15} />
            <span>Live Chat</span>
          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-6 text-sm">

          <button className="flex items-center gap-1 hover:text-[#CBB05B]">
            <Globe size={15} />
            English
            <ChevronDown size={14} />
          </button>

          <button className="flex items-center gap-1 hover:text-[#CBB05B]">
            KES
            <ChevronDown size={14} />
          </button>

          <Link
            href="/track-order"
            className="hidden lg:flex items-center gap-2 hover:text-[#CBB05B]"
          >
            <MapPinned size={15} />
            Track Order
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 hover:text-[#CBB05B]"
          >
            <User size={15} />
            Login
          </Link>

          <Link
            href="/wishlist"
            className="relative hover:text-[#CBB05B]"
          >
            <Heart size={18} />
          </Link>

          <Link
            href="/cart"
            className="relative hover:text-[#CBB05B]"
          >
            <ShoppingCart size={18} />

            <span
              className="
                absolute
                -right-2
                -top-2
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-[#CBB05B]
                text-[11px]
                font-bold
                text-white
              "
            >
              0
            </span>

          </Link>

        </div>

      </div>

    </div>
  );
}