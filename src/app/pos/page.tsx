'use client';

import { useState } from 'react';
import { usePos } from './hooks/usePos';
import { PosCart } from '@/components/posCart';
import { PosHeader } from '@/components/posHeader';

export default function PosPage() {
  // 🚀 ດຶງຂໍ້ມູນ ແລະ Logic ທັງໝົດມາຈາກ Hook ທີ່ເຮົາອັບເດດໃໝ່
  const { 
    products, 
    categories, 
    isLoading, 
    cart, 
    addToCart, 
    updateQuantity, 
    getTotalPrice,
    isCheckoutModalOpen,
    checkoutStatus,
    openCheckoutModal,
    confirmPayment,
    closeCheckoutModal
  } = usePos();
  
  // State ສຳລັບເກັບວ່າກຳລັງເລືອກແທັບປະເພດໃດຢູ່ (ຄ່າເລີ່ມຕົ້ນ 'all' ຄືທັງໝົດ)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-bold text-gray-500 bg-gray-50 text-sm tracking-wide">
        ⏳ ກຳລັງໂຫຼດຂໍ້ມູນເມນູ...
      </div>
    );
  }

  // ກອງສິນຄ້າ (Filter) ໃຫ້ສະແດງສະເພາະປະເພດທີ່ເລືອກ
  const filteredProducts = selectedCategoryId === 'all'
    ? products
    : products.filter(product => product.categoryId === selectedCategoryId);

  return (
    <div className="flex flex-col md:flex-row md:h-screen bg-slate-50 font-sans relative overflow-x-hidden md:overflow-hidden">
      
      {/* 🟢 ຝັ່ງຊ້າຍ: UI ສະແດງເມນູສິນຄ້າ ແລະ ແທັບປະເພດ */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-6 flex flex-col h-fit md:h-full overflow-y-auto">
        
        <PosHeader />

        {/* 🗂️ ແຖບເລືອກປະເພດສິນຄ້າ (Category Tabs) */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 shrink-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              selectedCategoryId === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🌟 ທັງໝົດ
          </button>
          
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                selectedCategoryId === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ☕ ຕາຕະລາງ Grid ສະແດງເມນູສິນຄ້າ (ມີຮູບພາບ) */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <span className="text-4xl mb-2">🔍</span>
              <p className="font-semibold text-sm">ບໍ່ມີລາຍການເມນູໃນປະເພດນີ້</p>
            </div>
          ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"> 
  {filteredProducts.map((product) => (
    <button
      key={product.id}
      onClick={() => addToCart(product)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 border border-gray-200 overflow-hidden flex flex-col text-left transition-all group"
    >
      {/* 📷 ສ່ວນສະແດງຮູບພາບ - ປັບ h-32 ໃຫ້ເບິ່ງກະທັດຮັດ */}
      <div className="w-full h-50 bg-gray-100 relative overflow-hidden">
        <img 
          src={product.image || 'https://placehold.co/400x300?text=No+Image'} 
          alt={product.name} 
          className="w-full h-full  object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
        {/* ແທັກບອກປະເພດ */}
        <span className="absolute top-2 right-2 bg-black/50 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm font-bold">
          {product.category?.name || 'ທົ່ວໄປ'}
        </span>
      </div>

      {/* 📝 ສ່ວນຂໍ້ມູນ */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </div>
        </div>
        
        {/* ຈັດການວາງແຖວໃໝ່: ລາຄາຢູ່ຊ້າຍ, ປຸ່ມບວກຢູ່ຂວາ */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
          <div className="text-blue-600 font-black text-sm">
            {product.price.toLocaleString()} ກີບ
          </div>
          
          {/* ປຸ່ມບວກ (ເພີ່ມເພື່ອຄວາມສວຍງາມ ແລະ ບອກໃຫ້ User ຮູ້ວ່າກົດເພີ່ມໄດ້) */}
          <div className="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm active:scale-95">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={3} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  ))}
</div>
          )}
        </div>
      </div>

      {/* 🔵 ຝັ່ງຂວາ: UI ຕະກ້າສິນຄ້າ (ປ່ຽນມາເອີ້ນ openCheckoutModal ເພື່ອເປີດປັອບອັບ) */}
      <PosCart
        cart={cart}
        updateQuantity={updateQuantity}
        getTotalPrice={getTotalPrice}
        onCheckout={openCheckoutModal}
      />

      {/* ======================================================= */}
      {/* 🚀 💎 MODAL ສະແກນ QR CODE ແລະ ALERT ສຸດງາມຢູ່ກາງຈໍ 💎 🚀 */}
      {/* ======================================================= */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 text-center transform scale-100 transition-all">
            
            {/* 📱 1. ໂໝດກຳລັງສະແກນ QR Code (Scanning) */}
            {checkoutStatus === 'scanning' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">📱 ສະແກນ QR Code ເພື່ອຊຳລະເງິນ</h3>
                <p className="text-xs text-gray-400 font-medium">ກະລຸນາໃຫ້ລູກຄ້າສະແກນຄິວອານີ້ເພື່ອໂອນເງິນເຂົ້າບັນຊີຮ້ານ</p>
                
                {/* 💵 ສະແດງຍອດລວມໃຫຍ່ໆ */}
                <div className="bg-blue-50 py-3 rounded-2xl">
                  <span className="text-[10px] text-blue-600 font-bold block uppercase tracking-wider">ຍອດເງິນທີ່ຕ້ອງຊຳລະ</span>
                  <span className="text-2xl font-black text-blue-600">{getTotalPrice().toLocaleString()} ກີບ</span>
                </div>

                {/* 🖼️ ຕົວ QR Code (ແປງຍອດເງິນເຂົ້າລິ້ງອັດຕະໂນມັດ) */}
                <div className="flex items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl shadow-inner w-56 h-56 mx-auto relative">
                  <img 
                    src={`/QR.jpg?amount=${getTotalPrice()}`} 
                    alt="Payment QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-xs text-amber-500 font-semibold animate-pulse">● ລະບົບກຳລັງລໍຖ້າການຢືນຢັນສະແກນ...</p>

                {/* ປຸ່ມກົດຈັດການ */}
                <div className="flex gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={closeCheckoutModal} 
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition text-sm"
                  >
                    ຍົກເລີກ
                  </button>
                  <button 
                    type="button" 
                    onClick={confirmPayment} 
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition text-sm shadow-md shadow-blue-100"
                  >
                    ຮັບເງິນສຳເລັດ 👍
                  </button>
                </div>
              </div>
            )}

            {/* 🎉 2. ໂໝດແຈ້ງເຕືອນ ຈ່າຍເງິນສຳເລັດ (Success Alert) */}
            {checkoutStatus === 'success' && (
              <div className="py-4 space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                  🎉
                </div>
                <h3 className="text-2xl font-black text-emerald-600">ຊຳລະເງິນສຳເລັດ!</h3>
                <p className="text-gray-500 text-sm px-6 font-medium">ບັນທຶກອໍເດີ້ເຂົ້າລະບົບ ແລະ ລ້າງຕະກ້າຮຽບຮ້ອຍແລ້ວ.</p>
                <button 
                  type="button" 
                  onClick={closeCheckoutModal} 
                  className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-100 text-sm"
                >
                  ຮັບອໍເດີ້ຖັດໄປ 🚀
                </button>
              </div>
            )}

            {/* ❌ 3. ໂໝດແຈ້ງເຕືອນ ເກີດຂໍ້ຜິດພາດ (Error Alert) */}
            {checkoutStatus === 'error' && (
              <div className="py-4 space-y-4">
                <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                  ❌
                </div>
                <h3 className="text-2xl font-black text-rose-600">ເກີດຂໍ້ຜິດພາດ</h3>
                <p className="text-gray-500 text-sm font-medium">ບໍ່ສາມາດບັນທຶກອໍເດີ້ໄດ້, ກະລຸນາກວດສອບ API ຫຼື Network ຄືນໃໝ່.</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    type="button" 
                    onClick={closeCheckoutModal} 
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition text-sm"
                  >
                    ປິດໜ້າຕ່າງ
                  </button>
                  <button 
                    type="button" 
                    onClick={confirmPayment} 
                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition text-sm shadow-md"
                  >
                    ລອງໃໝ່ອີກຄັ້ງ
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}