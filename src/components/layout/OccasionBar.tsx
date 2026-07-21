'use client';

import Link from 'next/link';

import {
  Cake,
  Heart,
  Gem,
  Baby,
  GraduationCap,
  Home,
  Trees,
  PartyPopper,
  Gift,
} from 'lucide-react';

const occasions = [
  {
    name: 'Birthday',
    href: '/occasion/birthday',
    icon: Cake,
  },
  {
    name: 'Anniversary',
    href: '/occasion/anniversary',
    icon: Heart,
  },
  {
    name: 'Wedding',
    href: '/occasion/wedding',
    icon: Gem,
  },
  {
    name: 'Baby Shower',
    href: '/occasion/baby-shower',
    icon: Baby,
  },
  {
    name: 'Graduation',
    href: '/occasion/graduation',
    icon: GraduationCap,
  },
  {
    name: 'Housewarming',
    href: '/occasion/housewarming',
    icon: Home,
  },
  {
    name: 'Christmas',
    href: '/occasion/christmas',
    icon: Trees,
  },
  {
    name: 'Congratulations',
    href: '/occasion/congratulations',
    icon: PartyPopper,
  },
  {
    name: 'All Gifts',
    href: '/products',
    icon: Gift,
  },
];

export default function OccasionBar() {
  return (
    <section className="border-b border-gray-100 bg-white">

      <div className="mx-auto max-w-[1800px]">

        <div
          className="
            flex
            gap-3
            overflow-x-auto
            px-6
            py-4
            scrollbar-hide
          "
        >
          {occasions.map((occasion) => {

            const Icon = occasion.icon;

            return (
              <Link
                key={occasion.name}
                href={occasion.href}
                className="
                  flex
                  shrink-0
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  px-5
                  py-3
                  transition-all
                  duration-300
                  hover:border-[#1B7979]
                  hover:bg-[#1B7979]
                  hover:text-white
                  hover:shadow-lg
                "
              >
                <Icon size={18} />

                <span className="font-medium whitespace-nowrap">
                  {occasion.name}
                </span>

              </Link>
            );
          })}
        </div>

      </div>

    </section>
  );
}