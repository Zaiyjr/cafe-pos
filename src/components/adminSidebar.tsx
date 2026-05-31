'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ArrowLeftRight, Coffee, X } from 'lucide-react';

// 🚀 ເພີ່ມ Interface Props ເພື່ອຮັບຄ່າການເປີດ/ປິດ ຈາກໜ້າຫຼັກ (Admin Page)
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname(); // 🚀 ໃຊ້ກວດສອບວ່າຕອນນີ້ຢູ່ Page ໃດ

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/admin/products', label: 'ຈັດການເມນູ', icon: <Package size={20} /> },
  ];

  return (
    <>
      {/* 1. BACKGROUND OVERLAY: ຈະສະແດງສະເພາະໃນມືຖື ເມື່ອມີການກົດເປີດເມນູ */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
        />
      )}

      {/* 2. SIDEBAR CONTAINER: ຮອງຮັບການສະໄລ້ (Transition) ເຂົ້າ-ອອກໃນຈໍມືຖື */}
      <aside className={`
        w-64 bg-slate-900 text-slate-300 h-screen p-6 fixed flex flex-col shadow-2xl z-50
        transition-transform duration-300 ease-in-out top-0 left-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header & Close Button (ປຸ່ມປິດຈະສະແດງສະເພາະໃນມືຖື) */}
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30">
              <Coffee size={22} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Cafe POS</h2>
          </div>
          
          {/* ປຸ່ມກົດປິດ (ສະແດງສະເພາະ Mobile) */}
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white lg:hidden transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href; // Check ວ່າ Link ກົງກັບ URL ປັດຈຸບັນບໍ່
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={onClose} // ເມື່ອກົດເມນູໃນມືຖື ໃຫ້ປິດ Sidebar ອັດຕະໂນມັດ
                className={`flex items-center gap-3 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15 scale-[1.02]' 
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`}
              >
                <span className={isActive ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Exit Section */}
        <div className="border-t border-slate-800 pt-5">
          <Link 
            href="/pos" 
            className="flex items-center gap-3 py-3 px-4 text-blue-400 hover:bg-blue-950/40 rounded-xl transition-all font-bold text-sm group"
          >
            <ArrowLeftRight size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>ກັບໄປໜ້າ POS</span>
          </Link>
        </div>
      </aside>
    </>
  );
}