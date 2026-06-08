'use client';

import { signOut } from 'next-auth/react';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LogoutButtonProps {
  className?: string;
  showLabel?: boolean;
}

export function LogoutButton({ className = '', showLabel = true }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-all disabled:opacity-60 ${className}`}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogOut size={16} />
      )}
      {showLabel && <span>ອອກຈາກລະບົບ</span>}
    </button>
  );
}
