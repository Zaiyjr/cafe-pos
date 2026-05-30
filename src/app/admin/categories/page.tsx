'use client';

import { useCategory } from './hooks/useCategory';

export default function AdminCategoriesPage() {
  // 🚀 ດຶງ toast ທີ່ເຮົາເພີ່ມໄວ້ໃນ useCategory() ອອກມາໃຊ້ງານ
  const { categories, newCategoryName, setNewCategoryName, isLoading, handleCreateCategory, toast } = useCategory();

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans relative">
      
      {/* 🚀 1. ກ່ອງ Custom Toast Alert (Tailwind CSS) ຈະລອຍຢູ່ມຸມຂວາເທິງ */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm animate-fade-in">
          {toast.type === 'success' ? (
            <div className="bg-emerald-500 text-white px-5 py-3.5 rounded-2xl flex items-center gap-2 shadow-xl font-semibold text-sm border border-emerald-400">
              <span className="text-lg">✅</span> 
              <span>{toast.message}</span>
            </div>
          ) : (
            <div className="bg-rose-500 text-white px-5 py-3.5 rounded-2xl flex items-center gap-2 shadow-xl font-semibold text-sm border border-rose-400">
              <span className="text-lg">❌</span> 
              <span>{toast.message}</span>
            </div>
          )}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">🗂️ ຈັດການປະເພດສິນຄ້າ (Categories)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ຝັ່ງຊ້າຍ: ຟອມເພີ່ມປະເພດສິນຄ້າ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold text-gray-700 mb-4">ເພີ່ມປະເພດໃໝ່</h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ชື່ປະເພດສິນຄ້າ</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="ເຊັ່ນ: ກາເຟຮ້ອນ, ເບເກີຣີ"
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              ບັນທຶກ
            </button>
          </form>
        </div>

        {/* ຝັ່ງຂວາ: ຕາຕະລາງສະແດງຂໍ້ມູນ */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-700 mb-4">ລາຍການທັງໝົດ ({categories.length})</h2>
          
          {isLoading ? (
            <p className="text-gray-500 text-center py-6">ກຳລັງໂຫຼດ...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-400 text-center py-6">ບໍ່ມີຂໍ້ມູນປະເພດສິນຄ້າ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="pb-3 font-medium w-16"># ລຳດັບ</th>
                    <th className="pb-3 font-medium">ຊື່ປະເພດ</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-sm text-gray-400">{index + 1}</td>
                      <td className="py-3 font-semibold text-gray-800">{category.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}