'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'flex items-center justify-center rounded-full transition-all duration-300',
        {
          'h-9 w-9': size === 'sm',
          'h-11 w-11': size === 'md',
          'h-14 w-14': size === 'lg',

          'bg-[#1B7979] text-white hover:bg-[#166868] hover:shadow-xl':
            variant === 'primary',

          'bg-[#CBB05B] text-white hover:bg-[#b99b43] hover:shadow-xl':
            variant === 'secondary',

          'bg-white text-gray-700 shadow-md hover:scale-110 hover:shadow-xl':
            variant === 'ghost',
        },
        className,
      )}
    >
      {icon}
    </button>
  );
}