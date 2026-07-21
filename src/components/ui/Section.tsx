'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function Section({
  children,
  title,
  subtitle,
  className = '',
}: SectionProps) {
  return (
    <section
      className={clsx(
        'py-20',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">

        {(title || subtitle) && (

          <div className="mb-12">

            {subtitle && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#CBB05B]">
                {subtitle}
              </p>
            )}

            {title && (
              <h2 className="text-4xl font-bold text-gray-900">
                {title}
              </h2>
            )}

          </div>

        )}

        {children}

      </div>
    </section>
  );
}