'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Luxury Flower Collection',
    subtitle: 'Fresh flowers beautifully arranged and delivered the same day.',
    href: '/products?category=flowers',
    image: '/hero/flowers.png',
    background: 'from-rose-100 via-pink-100 to-fuchsia-200',
  },
  {
    id: 2,
    title: 'Premium Gift Hampers',
    subtitle: 'Curated luxury hampers for birthdays, anniversaries and celebrations.',
    href: '/products?category=hampers',
    image: '/hero/giftbox1.png',
    background: 'from-amber-100 via-yellow-100 to-orange-200',
  },
  {
    id: 3,
    title: 'Luxury Perfumes',
    subtitle: 'Premium fragrances for him and her from top global brands.',
    href: '/products?category=perfumes',
    image: '/hero/perfume1.png',
    background: 'from-sky-100 via-cyan-100 to-blue-200',
  },
  {
    id: 4,
    title: 'Fashion & Accessories',
    subtitle: 'Complete your gift with premium fashion accessories.',
    href: '/products?category=fashion',
    image: '/hero/shoes.png',
    background: 'from-slate-100 via-gray-100 to-zinc-200',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(timer);
  }, [current]);

  function nextSlide() {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }

  function previousSlide() {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }

  const slide = slides[current];

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-r ${slide.background}`}
    >
      <Link
        href={slide.href}
        className="relative mx-auto flex min-h-[340px] max-w-[1500px] items-center px-8 py-10 sm:px-12 lg:min-h-[400px] lg:px-20"
      >
        {/* LEFT — title + subtitle, no badge/button, just like Amazon's hero */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-4 text-base text-gray-700 sm:text-lg">
            {slide.subtitle}
          </p>
        </div>

        {/* RIGHT — image bleeds toward (and past) the right edge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] items-center justify-end sm:flex">
          <Image
            src={slide.image}
            alt={slide.title}
            width={640}
            height={640}
            priority
            className="relative h-auto w-[125%] max-w-none translate-x-[10%] object-contain drop-shadow-2xl"
          />
        </div>
      </Link>

      {/* Nav arrows pinned to the true viewport edges */}
      <button
        onClick={(e) => {
          e.preventDefault();
          previousSlide();
        }}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white sm:left-6 sm:h-11 sm:w-11"
      >
        <ChevronLeft size={22} className="text-gray-700" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          nextSlide();
        }}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white sm:right-6 sm:h-11 sm:w-11"
      >
        <ChevronRight size={22} className="text-gray-700" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setCurrent(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === index
                ? 'w-6 bg-gray-800'
                : 'w-1.5 bg-gray-500/50 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
}