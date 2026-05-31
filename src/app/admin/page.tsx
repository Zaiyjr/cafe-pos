'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  totalAmount: number;
  category: string;
  createdAt: string;
  items: { productName?: string; name?: string; quantity: number }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState({ 
    summary: { daily: 0, weekly: 0, monthly: 0, yearly: 0 }, 
    history: [],
    topProducts: [] as TopProduct[],
    recentOrders: [] as RecentOrder[]
  });
  
  const [filter, setFilter] = useState('weekly'); // ສຳລັບ Filter ກາຟ
  const [historyFilter, setHistoryFilter] = useState('daily'); // ວັນນີ້, ອາທິດນີ້, ເດືອນນີ້, custom_date, custom_month
  
  // 🚀 1. ເພີ່ມ State ສຳລັບເກັບຄ່າວັນທີ/ເດືອນ ທີ່ຜູ້ໃຊ້ເຈາະຈົງເລືອກເບິ່ງຍ້ອນຫຼັງ
  const [customDate, setCustomDate] = useState(''); // ເກັບຄ່າ YYYY-MM-DD
  const [customMonth, setCustomMonth] = useState(''); // ເກັບຄ່າ YYYY-MM
  
  const [loading, setLoading] = useState(true);

  // 🚀 2. ປັບປຸງ useEffect ໃຫ້ສົ່ງຄ່າ customDate ຫຼື customMonth ໄປທີ່ API ນຳ
  useEffect(() => {
    setLoading(true);
    
    let url = `/api/stats?period=${filter}&historyPeriod=${historyFilter}`;
    
    if (historyFilter === 'custom_date' && customDate) {
      url += `&selectedDate=${customDate}`;
    } else if (historyFilter === 'custom_month' && customMonth) {
      url += `&selectedMonth=${customMonth}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, historyFilter, customDate, customMonth]); // 🚀 ໃຫ້ຕື່ມ customDate, customMonth ເຂົ້າບ່ອນນີ້ເພື່ອໃຫ້ມັນໂຫຼດໃໝ່ທັນທີເວລາປ່ຽນວັນທີ

  const cardLabels: { [key: string]: string } = {
    daily: 'ຍອດຂາຍມື້ນີ້',
    weekly: 'ຍອດຂາຍອາທິດນີ້',
    monthly: 'ຍອດຂາຍເດືອນນີ້',
    yearly: 'ຍອດຂາຍປີນີ້'
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen font-sans text-slate-800 antialiased w-full max-w-[1600px] mx-auto space-y-6 md:space-y-8">
      
      {/* 📊 Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-2xl text-xl">📊</span>
            Dashboard ຍອດຂາຍ
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">ວິເຄາະສະຖິຕິການຂາຍ, ລາຍຮັບ ແລະ ປະຫວັດບິນຍ້ອນຫຼັງ</p>
        </div>
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)} 
          className="w-full sm:w-auto p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all"
        >
          <option value="weekly">ສະຖິຕິອາທິດນີ້</option>
          <option value="monthly">ສະຖິຕິເດືອນນີ້</option>
          <option value="yearly">ສະຖິຕິປີນີ້</option>
        </select>
      </div>

      {/* 💰 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Object.entries(data.summary).map(([key, val]) => (
          <div key={key} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/80 hover:shadow-md transition-all group">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{cardLabels[key] || key}</p>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-2 flex items-baseline gap-1 group-hover:text-blue-600 transition-colors">
              {Number(val).toLocaleString()} 
              <span className="text-xs md:text-sm font-normal text-slate-400">ກີບ</span>
            </h2>
          </div>
        ))}
      </div>

      {/* 📉 Area Chart Card */}
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-sm md:text-base text-slate-700 mb-6 flex items-center gap-2">
          <span>📉</span> ກາຟສະຖິຕິຍອດຂາຍ ({filter === 'weekly' ? 'ລາຍວັນ' : filter === 'monthly' ? 'ລາຍວັນໃນເດືອນ' : 'ລາຍເດືອນ'})
        </h3>
        <div className="h-64 md:h-80 w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-semibold text-sm">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ກີບ`, 'ຍອດຂາຍ']}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 📜 Lists Layout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* 📋 ຝັ່ງຊ້າຍ: ປະຫວັດການຂາຍໃນອະດີດ */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
          
          {/* 🚀 ປັບປຸງສ່ວນ Header ຂອງຕາຕະລາງໃຫ້ຮອງຮັບການເລືອກວັນທີຍ້ອນຫຼັງ */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                  <span>📜</span> ປະຫວັດການຂາຍຍ້ອນຫຼັງ
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">ຄົ້ນຫາບິນເກົ່າ ແລະ ກວດເບິ່ງລາຍການເມນູທີ່ເຄີຍຂາຍ</p>
              </div>
              
              {/* Tabs ປ່ຽນໄລຍະເວລາເບິ່ງປະຫວັດ */}
              <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner w-full sm:w-auto overflow-x-auto">
                {[
                  { key: 'daily', label: 'ວັນນີ້' },
                  { key: 'weekly', label: 'ອາທິດນີ້' },
                  { key: 'monthly', label: 'ເດືອນນີ້' },
                  { key: 'custom_date', label: 'ລະບຸວັນທີ' },   // 🚀 ເພີ່ມ Tab ລະບຸວັນທີ
                  { key: 'custom_month', label: 'ລະບຸເດືອນ' }  // 🚀 ເພີ່ມ Tab ລະບຸເດືອນ
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setHistoryFilter(tab.key)}
                    className={`flex-1 sm:flex-none text-center px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      historyFilter === tab.key
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 🚀 3. ເພີ່ມກ່ອງ Input ວັນທີ ທີ່ຈະສະແດງຂຶ້ນມາສະເພາະຕອນກົດເລືອກ Custom Filter */}
            {(historyFilter === 'custom_date' || historyFilter === 'custom_month') && (
              <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in">
                <span className="text-xs font-bold text-slate-500">📅 ເລືອກຊ່ວງເວລາອະດີດ:</span>
                
                {historyFilter === 'custom_date' && (
                  <input 
                    type="date" 
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="p-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                )}

                {historyFilter === 'custom_month' && (
                  <input 
                    type="month" 
                    value={customMonth}
                    onChange={(e) => setCustomMonth(e.target.value)}
                    className="p-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
                
                {/* ແນະນຳສະຖານະການຄົ້ນຫາ */}
                <span className="text-[11px] text-slate-400">
                  {historyFilter === 'custom_date' && !customDate && '⚠️ ກະລຸນາເລືອກວັນທີ'}
                  {historyFilter === 'custom_month' && !customMonth && '⚠️ ກະລຸນາເລືອກເດືອນ'}
                  {historyFilter === 'custom_date' && customDate && `ກຳລັງສະແດງບິນຂອງວັນທີ ${new Date(customDate).toLocaleDateString('lo-LA')}`}
                  {historyFilter === 'custom_month' && customMonth && `ກຳລັງສະແດງບິນຂອງເດືອນ ${customMonth}`}
                </span>
              </div>
            )}
          </div>
          
          {/* Responsive Table Wrapper */}
          <div className="w-full overflow-x-auto rounded-2xl border border-slate-50">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-4 font-semibold">ວັນທີ/ເວລາ</th>
                  <th className="py-3 px-2 font-semibold">ລະຫັດບິນ</th>
                  <th className="py-3 px-2 font-semibold">ລາຍການເມນູ</th>
                  <th className="py-3 px-2 font-semibold text-center">ຈຳນວນ</th>
                  <th className="py-3 px-4 font-semibold text-right">ຍອດລວມ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs md:text-sm text-slate-600">
                {data.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-medium">
                      {new Date(order.createdAt).toLocaleDateString('lo-LA', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    
                    <td className="py-3.5 px-2 whitespace-nowrap">
                      <span className="font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-bold">
                        #{order.id?.slice(-6).toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    
                    <td className="py-3.5 px-2 font-bold text-slate-700 max-w-[200px] truncate">
                      <div className="flex flex-col space-y-1">
                        {order.items?.map((item, idx) => (
                          <span key={idx} className="block truncate text-slate-700">
                            {item.productName || item.name || 'ບໍ່ມີຊື່ເມນູ'}
                          </span>
                        ))}
                      </div>
                    </td>
                    
                    <td className="py-3.5 px-2 text-center text-slate-400 font-bold">
                      <div className="flex flex-col space-y-1">
                        {order.items?.map((item, idx) => (
                          <span key={idx} className="block text-slate-500 bg-slate-50 rounded-md border border-slate-100 px-1 w-9 text-center mx-auto text-[11px]">
                            x{item.quantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 whitespace-nowrap text-sm md:text-base">
                      {order.totalAmount.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-400">ກີບ</span>
                    </td>
                  </tr>
                ))}
                
                {(!data.recentOrders || data.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      📭 ບໍ່ມີປະຫວັດການຂາຍໃນຊ່ວງເວລານີ້
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🏆 ຝັ່ງຂວາ: 5 ອັນດັບເມນູຂາຍດີ */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 w-full">
          <h3 className="font-bold text-base md:text-lg text-slate-800 mb-5 flex items-center gap-2">
            <span>🏆</span> 5 ອັນດັບເມນູຂາຍດີ
          </h3>
          <div className="space-y-3">
            {data.topProducts?.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-slate-200 text-slate-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate">{product.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">ຂາຍໄດ້ {product.quantity} ແກ້ວ</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-[10px] font-semibold text-slate-400 block">ຍອດລວມ</span>
                  <p className="text-xs md:text-sm font-black text-slate-700">{product.revenue.toLocaleString()} ກີບ</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}