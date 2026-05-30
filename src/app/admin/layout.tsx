// src/app/admin/layout.tsx
import { AdminSidebar } from '@/components/adminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar ຈະສະແດງຢູ່ທາງຊ້າຍຕະຫຼອດ */}
      <AdminSidebar />
      
      {/* ເນື້ອຫາທາງຂວາຈະປ່ຽນໄປຕາມໜ້າທີ່ເຈົ້າກົດ */}
      <main className="flex-1 ml-64 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}