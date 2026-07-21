'use client';

import { ReactNode } from 'react';

import UtilityNavbar from './UtilityNavbar';
import MainNavbar from './MainNavbar';
import OccasionBar from './OccasionBar';

interface AppLayoutProps {
  children: ReactNode;
  showUtilityBar?: boolean;
  showOccasionBar?: boolean;
}

export default function AppLayout({
  children,
  showUtilityBar = true,
  showOccasionBar = true,
}: AppLayoutProps) {
  return (
    <>
      {showUtilityBar && <UtilityNavbar />}

      <MainNavbar />

      {showOccasionBar && <OccasionBar />}

      <main className="min-h-screen bg-rexo-ivory">
        {children}
      </main>
    </>
  );
}