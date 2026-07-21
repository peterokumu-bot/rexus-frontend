import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div
      className="
        w-full
        max-w-md
        rounded-section
        border
        border-rexo
        bg-white
        p-8
        shadow-card
      "
    >
      {children}
    </div>
  );
}