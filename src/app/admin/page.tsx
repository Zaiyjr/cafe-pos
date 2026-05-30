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
  items: { productName: string; quantity: number }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState({ 
    summary: { daily: 0, weekly: 0, monthly: 0, yearly: 0 }, 
    history: [],
    topProducts: [] as TopProduct[],
    recentOrders: [] as RecentOrder[]
  });
  
  const [filter, setFilter] = useState('weekly'); // ສໍາລັບກາຟ
  const [historyFilter, setHistoryFilter] = useState('daily'); // 🚀 ສໍາລັບປະຫວັດການຂາຍ (daily, weekly, monthly)
  const [loading, setLoading] = useState(true);

  // ໂຫຼດຂໍ້ມູນໃໝ່ ເມື່ອ filter ກາຟ ຫຼື filter ປະຫວັດການຂາຍມີການປ່ຽນແປງ
  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats?period=${filter}&historyPeriod=${historyFilter}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, historyFilter]);

  const cardLabels: { [key: string]: string } = {
    daily: 'ຍອດຂາຍມື້ນີ້',
    weekly: 'ຍອດຂາຍອາທິດນີ້',
    monthly: 'ຍອດຂາຍເດືອນນີ້',
    yearly: 'ຍອດຂາຍປີນີ້'
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard ຍອດຂາຍ</h1>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)} 
          className="p-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="weekly">ອາທິດນີ້</option>
          <option value="monthly">ເດືອນນີ້</option>
          <option value="yearly">ປີນີ້</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(data.summary).map(([key, val]) => (
          <div key={key} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs uppercase font-bold">{cardLabels[key] || key}</p>
            <h2 className="text-2xl font-black text-gray-800 mt-2">
              {Number(val).toLocaleString()} <span className="text-sm font-normal text-gray-400">ກີບ</span>
            </h2>
          </div>
        ))}
      </div>

      {/* Graph Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-lg text-gray-700 mb-6">
          📉 ສະຖິຕິຍອດຂາຍ ({filter === 'weekly' ? 'ລາຍວັນ' : filter === 'monthly' ? 'ລາຍວັນໃນເດືອນ' : 'ລາຍເດືອນ'})
        </h3>
        <div className="h-80">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ກີບ`, 'ຍອດຂາຍ']}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ຝັ່ງຊ້າຍ: ປະຫວັດການຂາຍລ່າສຸດ (ມີປຸ່ມແຍກ ວັນ/ອາທິດ/ເດືອນ) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-bold text-lg text-gray-800">📜 ປະຫວັດການຂາຍ</h3>
            
            {/* 🚀 ປຸ່ມກົດແຍກ: ວັນ / ອາທິດ / ເດືອນ */}
            <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
              {[
                { key: 'daily', label: 'ວັນນີ້' },
                { key: 'weekly', label: 'ອາທິດນີ້' },
                { key: 'monthly', label: 'ເດືອນນີ້' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setHistoryFilter(tab.key)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    historyFilter === tab.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-100">
                  <th className="pb-3 font-semibold">ວັນທີ/ເວລາ</th>
                  <th className="pb-3 font-semibold">ປະເພດ</th>
                  <th className="pb-3 font-semibold">...ລາຍການເມນູ</th>
                  <th className="pb-3 font-semibold text-center">ຈຳນວນ</th>
                  <th className="pb-3 font-semibold text-right">ຍອດລວມ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {data.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('lo-LA', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 text-gray-500 whitespace-nowrap">
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-medium">
                        {order.category || 'ທົ່ວໄປ'}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-gray-700 max-w-[220px] truncate">
                      <div className="flex flex-col space-y-0.5">
                        {order.items?.map((item, idx) => (
                          <span key={idx} className="block truncate">{item.productName}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-center text-gray-600 font-semibold">
                      <div className="flex flex-col space-y-0.5">
                        {order.items?.map((item, idx) => (
                          <span key={idx} className="block text-gray-400 text-xs">x{item.quantity}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-blue-600 whitespace-nowrap">
                      {order.totalAmount.toLocaleString()} ກີບ
                    </td>
                  </tr>
                ))}
                {(!data.recentOrders || data.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      ບໍ່ມີປະຫວັດການຂາຍໃນຊ່ວງເວລານີ້
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ຝັ່ງຂວา: 5 ອັນດັບເມນູຂາຍດີ */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4">🏆 5 ອັນດັບເມນູຂາຍດີ</h3>
          <div className="space-y-4">
            {data.topProducts?.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/60 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-y-1">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mr-3 ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-slate-100 text-slate-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-400">ຂາຍໄດ້ {product.quantity} ແກ້ວ</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-500">ຍອດລວມ</span>
                  <p className="text-sm font-bold text-gray-800">{product.revenue.toLocaleString()} ກີບ</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}