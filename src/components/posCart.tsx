import { Trash } from "lucide-react";

export function PosCart({ cart, updateQuantity, getTotalPrice, onCheckout }: any) {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col h-fit md:h-full shadow-2xl sticky bottom-0 z-20">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">🛒 ກະຕ່າສິນຄ້າ ({cart.length})</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">ຕະກ້າວ່າງເປົ່າ</p>
        ) : (
          cart.map((item: any) => (
            <div key={item.id} className="flex gap-3 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
              {/* 📷 ຮູບພາບສິນຄ້າໃນຕະກ້າ */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border shadow-sm">
                <img 
                  src={item.image || 'https://placehold.co/150?text=No+Img'} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                {/* 📝 ຊື່ ແລະ ປະເພດ */}
                <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  {item.category?.name || 'ທົ່ວໄປ'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-white rounded-lg border flex items-center justify-center hover:bg-gray-100">-</button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-white rounded-lg border flex items-center justify-center hover:bg-gray-100">+</button>
              </div>

              {/* trash icon ສໍາລັບລົບລາຍການ */}
              <button onClick={() => updateQuantity(item.id, 0)} className="ml-2 text-red-500 hover:text-red-700 transition">
                <Trash size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer ສ່ວນສະຫຼຸບລາຄາ */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>ລວມທັງໝົດ:</span>
          <span>{getTotalPrice().toLocaleString()} ກີບ</span>
        </div>
        <button 
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          ຊຳລະເງິນ ({cart.length} ລາຍການ)
        </button>
      </div>
    </div>
  );
}