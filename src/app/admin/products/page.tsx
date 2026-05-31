"use client";

import { useProduct } from "./hooks/useProduct";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    isLoading,
    toast,
    editingId,
    form,
    categoryModal,
    handleSaveProduct,
    setEditForm,
    handleDeleteProduct,
  } = useProduct();

  // 🚀 Logic Preview: ໃຊ້ຄ່າທີ່ມີ (imageBase64 ຈະມີຄວາມສຳຄັນກວ່າ imageUrl)
  const previewImage = form.imageBase64 || form.imageUrl;

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen font-sans text-slate-800 antialiased relative w-full max-w-[1600px] mx-auto space-y-6 md:space-y-8">
      
      {/* Toast Alert ແບບມີແອນິເມຊັນຫຼູຫຼາ */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl shadow-slate-200/50 text-white font-semibold text-sm flex items-center gap-3 animate-fade-in backdrop-blur-md ${
            toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
          }`}
        >
          <span className="text-base">{toast.type === "success" ? "✨" : "⚠️"}</span>
          {toast.message}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-2xl text-xl">📦</span>
            ຈັດການເມນູສິນຄ້າ
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">ເພີ່ມ, ແກ້ໄຂ ແລະ ຄວບຄຸມລາຍການອາຫານ/ເຄື່ອງດື່ມທັງໝົດໃນຮານຂອງທ່ານ</p>
        </div>
      </div>

      {/* Main Grid Layout (ລຽງແນວຕັ້ງໃນມືຖື, ແນວຂວາງໃນຈໍໃຫຍ່) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* ---------------------------------------------------- */}
        {/* 📁 ຝັ່ງຊ້າຍ: ຟອມເພີ່ມ/ແກ້ໄຂເມນູ (ເປັນ Sticky เฉพาะจอใหญ่) */}
        {/* ---------------------------------------------------- */}
        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5 md:sticky md:top-6">
          <div className="border-b border-slate-50 pb-3">
            <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
              {editingId ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  ແກ້ໄຂເມນູສິນຄ້າ
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  ເພີ່ມເມນູໃໝ່
                </>
              )}
            </h2>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-4 md:space-y-5">
            {/* ສ່ວນເລືອກຮູບພາບ */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                ຮູບພາບສິນຄ້າ
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl mb-3 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => form.setImageType("file")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    form.imageType === "file" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  📁 ອັບໂຫຼດໄຟລ໌
                </button>
                <button
                  type="button"
                  onClick={() => form.setImageType("url")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    form.imageType === "url" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🔗 ວາງລິ້ງ URL
                </button>
              </div>

              {form.imageType === "file" ? (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50/50 hover:border-blue-400 transition-colors group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-blue-500 transition-colors">
                    ກົດເພື່ອເລືອກໄຟລ໌ຮູບພາບ
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={form.handleFileChange}
                  />
                </label>
              ) : (
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => form.setImageUrl(e.target.value)}
                  placeholder="ວາງ URL ຂອງຮູບພາບຢູ່ບ່ອນນີ້..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all placeholder:text-slate-300"
                />
              )}

              {/* Preview ຮູບພາບ */}
              {previewImage && (
                <div className="mt-4 relative w-full h-36 rounded-2xl overflow-hidden border border-slate-100 group shadow-inner">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <button
                    type="button"
                    onClick={() => {
                      form.setImageUrl("");
                      form.setImageBase64("");
                    }}
                    className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-rose-600 text-white w-7 h-7 rounded-xl text-xs flex items-center justify-center transition-all shadow-md active:scale-90"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <Input
              label="👑 ຊື່ເມນູສິນຄ້າ"
              placeholder="ຕົວຢ່າງ: ອາເມຣິກາໂນ້ເຢັນ"
              value={form.name}
              onChange={form.setName}
            />
            
            <Input
              label="💰 ລາຄາສິນຄ້າ (ກີບ)"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={form.setPrice}
            />

            {/* ສ່ວນເລືອກປະເພດ */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                🗂️ ປະເພດເມນູ
              </label>
              <div className="flex gap-2 w-full items-center">
                <div className="flex-1 min-w-0">
                  <select
                    value={form.categoryId}
                    onChange={(e) => form.setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="" className="text-slate-400">-- ເລືອກປະເພດ --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => categoryModal.setIsOpen(true)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all active:scale-95 text-lg h-[42px] w-[42px] flex items-center justify-center flex-shrink-0"
                  title="ເພີ່ມປະເພດໃໝ່"
                >
                  +
                </button>
              </div>
            </div>

            {/* ປຸ່ມບັນທຶກ */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all active:scale-[0.98] mt-2 ${
                editingId 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-100" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-100"
              }`}
            >
              {editingId ? "✨ ອັບເດດຂໍ້ມູນເມນູ" : "💾 ບັນທຶກເມນູເຂົ້າລະບົບ"}
            </button>
          </form>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 📊 ຝັ່ງຂວາ: ຕາຕະລາງລາຍການເມນູທັງໝົດ */}
        {/* ---------------------------------------------------- */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center bg-white">
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-800">
                ລາຍການເມນູທັງໝົດ
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">ລາຍຊື່ສິນຄ້າທີ່ກຳລັງເປີດໃຊ້ງານໃນຮ້ານ</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
              {products.length} ລາຍການ
            </span>
          </div>

          {/* 🚀 ປ້ອງກັນຕາຕະລາງແຕກ/ເຍ້ໃນ Mobile ດ້ວຍ overflow-x-auto ແລະ min-w */}
          <div className="w-full overflow-x-auto rounded-b-3xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-20">ຮູບ</th>
                  <th className="py-4 px-4">ชື່ເມນູ</th>
                  <th className="py-4 px-4">ປະເພດ</th>
                  <th className="py-4 px-4 text-right">ລາຄາ</th>
                  <th className="py-4 px-6 text-center w-28">ຈັດການ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 text-xs md:text-sm font-medium">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* ບ່ອນສະແດງຮູບ */}
                    <td className="py-3 px-6 text-center">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden border border-slate-100 shadow-sm mx-auto bg-slate-50">
                        <img
                          src={product.image || "https://placehold.co/100"}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          alt={product.name}
                        />
                      </div>
                    </td>
                    
                    {/* ຊື່ເມນູ */}
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {product.name}
                    </td>
                    
                    {/* ປະເພດເມນູ */}
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-bold">
                        {product.category?.name || "ທົ່ວໄປ"}
                      </span>
                    </td>
                    
                    {/* ລາຄາ */}
                    <td className="py-3 px-4 text-right font-black text-blue-600 text-sm md:text-base">
                      {product.price.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-400">ກີບ</span>
                    </td>
                    
                    {/* ປຸ່ມກົດ Action */}
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditForm(product)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-xl transition-colors active:scale-90 shadow-sm text-xs"
                          title="ແກ້ໄຂ"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-colors active:scale-90 shadow-sm text-xs"
                          title="ລຶບ"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      📭 ບໍ່ມີລາຍການເມນູສິນຄ້າໃນລະບົບ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// ປັບປຸງ Reusable Input Component ໃຫ້ຫຼູຫຼາ ແລະ ເປັນ Responsive
function Input({ label, value, onChange, type = "text", placeholder }: any) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-bold transition-all placeholder:text-slate-300"
      />
    </div>
  );
}