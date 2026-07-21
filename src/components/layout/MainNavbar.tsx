'use client';

import Link from 'next/link';
import Image from 'next/image';

import api, { API_URL } from '@/lib/api'
import { useApp } from '@/context/AppContext';

import {
  Search,
  Gift,
  Grid2X2,
  Tag,
  Building2,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { SiteSettings } from '@/types/siteSettings';

export default function MainNavbar() {
 
  const { siteSettings } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">

      <div className="mx-auto flex h-24 max-w-[1800px] items-center gap-8 px-6">

        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
        >
<Image
  src={
    siteSettings?.logoUrl
      ? `${API_URL}${siteSettings.logoUrl}`
      : '/logo.png'
  }
  alt={siteSettings?.companyName || 'Rexus'}
  width={60}
  height={60}
  priority
/>
          <div>

            <h1 className="text-4xl font-black text-[#E61E8C]">
              Rexus
            </h1>

            <p className="text-sm text-gray-500">
              For Love, With Love.
            </p>

          </div>

        </Link>

        {/* GIFT FINDER */}

        <div className="flex flex-1 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">

          {/* Search Type */}

          <button className="flex items-center gap-2 border-r border-gray-200 px-6 font-medium hover:bg-gray-50">

            <Gift size={18} />

            Gift Finder

            <ChevronDown size={16} />

          </button>

          {/* Search */}

          <input
            placeholder="Who are you buying for today?"
            className="flex-1 px-6 text-lg outline-none"
          />

          {/* Search Button */}

          <button className="flex w-20 items-center justify-center bg-[#E61E8C] text-white transition hover:bg-pink-700">

            <Search size={22} />

          </button>

        </div>

        {/* RIGHT MENU */}

        <nav className="hidden xl:flex items-center gap-8">

          <Link
            href="/occasions"
            className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#E61E8C]"
          >
            <Gift size={24} />
            <span className="text-sm">
              Occasions
            </span>
          </Link>

          <Link
            href="/categories"
            className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#E61E8C]"
          >
            <Grid2X2 size={24} />
            <span className="text-sm">
              Categories
            </span>
          </Link>

          <Link
            href="/deals"
            className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#E61E8C]"
          >
            <Tag size={24} />
            <span className="text-sm">
              Deals
            </span>
          </Link>

          <Link
            href="/corporate"
            className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#E61E8C]"
          >
            <Building2 size={24} />
            <span className="text-sm">
              Corporate
            </span>
          </Link>

          <Link
            href="/gift-ai"
            className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#1B7979]"
          >
            <Sparkles size={24} />

            <span className="text-sm font-semibold">
              AI Finder
            </span>

          </Link>

        </nav>

      </div>

    </header>
  );
}