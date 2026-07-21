import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-100">
      {children}
    </main>
  );
}