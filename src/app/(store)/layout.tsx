import type { ReactNode } from 'react';

import AppLayout from '@/components/layout/AppLayout';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({
  children,
}: StoreLayoutProps) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}