'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
  padding = true,
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-[32px] bg-white transition-all duration-300',

        {
          'p-6': padding,

          'shadow-sm hover:-translate-y-2 hover:shadow-2xl':
            hover,
        },

        className,
      )}
    >
      {children}
    </div>
  );
}