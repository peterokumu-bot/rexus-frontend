'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={clsx(
        'mx-auto w-full max-w-[1800px] px-3 sm:px-4 lg:px-6 2xl:px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}