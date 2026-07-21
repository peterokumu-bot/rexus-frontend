'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'glass';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all',

        {
          'bg-[#1B7979] text-white':
            variant === 'primary',

          'bg-[#CBB05B] text-white':
            variant === 'secondary',

          'bg-green-100 text-green-700':
            variant === 'success',

          'bg-red-100 text-red-600':
            variant === 'danger',

          'bg-yellow-100 text-yellow-700':
            variant === 'warning',

          'border border-white/30 bg-white/40 text-gray-800 backdrop-blur-md':
            variant === 'glass',
        },

        className,
      )}
    >
      {children}
    </span>
  );
}