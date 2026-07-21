'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;

  onClick?: () => void;

  type?: 'button' | 'submit' | 'reset';

  disabled?: boolean;

  loading?: boolean;

  fullWidth?: boolean;

  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger';

  size?: 'sm' | 'md' | 'lg';

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  className?: string;
}

export default function Button({
  children,

  onClick,

  type = 'button',

  disabled = false,

  loading = false,

  fullWidth = false,

  variant = 'primary',

  size = 'md',

  leftIcon,

  rightIcon,

  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      className={clsx(
        `
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-pill
        font-semibold
        transition-all
        duration-300

        active:scale-95

        focus:outline-none
        focus:ring-4
        focus:ring-rexo-primary/20

        disabled:cursor-not-allowed
        disabled:opacity-60
        `,

        {
          'w-full': fullWidth,

          'px-4 py-2 text-sm':
            size === 'sm',

          'px-6 py-3 text-base':
            size === 'md',

          'px-8 py-4 text-lg':
            size === 'lg',

          'bg-rexo-primary text-white hover:bg-[#166868] hover:-translate-y-1 hover:shadow-card':
            variant === 'primary',

          'bg-rexo-secondary text-white hover:opacity-90 hover:-translate-y-1 hover:shadow-card':
            variant === 'secondary',

          'border border-rexo-primary bg-white text-rexo-primary hover:bg-rexo-primary hover:text-white':
            variant === 'outline',

          'bg-transparent text-rexo-primary hover:bg-rexo-primary/10':
            variant === 'ghost',

          'bg-red-600 text-white hover:bg-red-700':
            variant === 'danger',
        },

        className,
      )}
    >
      {loading ? (
        <>
          <Loader2
            size={18}
            className="animate-spin"
          />

          <span>
            Please wait...
          </span>
        </>
      ) : (
        <>
          {leftIcon}

          <span>{children}</span>

          {rightIcon}
        </>
      )}
    </button>
  );
}