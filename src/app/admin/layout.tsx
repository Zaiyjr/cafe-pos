'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/adminSidebar'; // 🚀 ປ່ຽນ Path ໃຫ້ກົງກັບໂຟນເດີຂອງເຈົ້າ
import { Menu } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🚀 State ສຳລັບຄວບຄຸມການ ເປີດ/ປິດ Sidebar ໃນມືຖື
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row text-slate-800 antialiased">
      
      {/* 1. SIDEBAR component: ສົ່ງ State ແລະ Function ໄປຄວບຄຸມ */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. MAIN CONTENT AREA */}
      {/* 💡 lg:pl-64 ແມ່ນການຍັບເນື້ອຫາໄປທາງຂວາເພື່ອຈອງບ່ອນໃຫ້ Sidebar ໃນຈໍຄອມ */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 w-full">
        
        {/* 📱 MOBILE HEADER: ຈະສະແດງສະເພາະໃນຈໍມືຖື (hidden lg:flex) */}
        <header className="flex lg:hidden items-center justify-between px-5 py-4 bg-slate-900 text-white sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span className="font-black tracking-tight text-sm">Cafe POS Admin</span>
          </div>
          
          {/* ປຸ່ມ Hamburger ສໍາລັບກົດເປີດ Sidebar */}
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl transition-all"
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* 📦 ສ່ວນເນື້ອຫາຂອງແຕ່ລະໜ້າ (Dashboard / ຈັດການເມນູ) */}
        <main className="flex-1 w-full">
          {children}
        </main>
        
      </div>
    </div>
  );
}