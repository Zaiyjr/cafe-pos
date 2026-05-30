import Link from 'next/link';
import { LayoutDashboard, Package, ArrowLeftRight, Coffee } from 'lucide-react';

export function AdminSidebar() {
  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/admin/products', label: 'ຈັດການເມນູ', icon: <Package size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-gray-300 h-screen p-6 fixed flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <Coffee size={24} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Cafe POS</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-200 group"
          >
            <span className="group-hover:text-blue-400">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Exit */}
      <div className="border-t border-gray-800 pt-6">
        <Link 
          href="/pos" 
          className="flex items-center gap-3 py-3 px-4 text-blue-400 hover:bg-blue-950/30 rounded-xl transition-all"
        >
          <ArrowLeftRight size={20} />
          <span className="font-bold">ກັບໄປໜ້າ POS</span>
        </Link>
      </div>
    </div>
  );
}