'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogoutButton } from '@/components/logoutButton';

export function PosHeader() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center mb-4 shrink-0">
      <h1 className="text-2xl font-black text-gray-800 tracking-tight">
        ☕ CAFE POS
      </h1>

      <div className="flex items-center gap-3">
        
        <Link
          href="/admin"
          className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ຍອດຂາຍ
        </Link>
        <LogoutButton
          showLabel={false}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
        />
      </div>
    </div>
  );
}
