import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  startOfYear, endOfYear, eachDayOfInterval, eachMonthOfInterval, format 
} from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // filter ສໍາລັບກາຟ
    const period = searchParams.get('period') || 'weekly'; 
    // filter ສໍາລັບປະຫວັດການຂາຍ
    const historyPeriod = searchParams.get('historyPeriod') || 'daily'; 
    
    // 🚀 1. ຮັບຄ່າຕົວແປວັນທີ ແລະ ເດືອນ ທີ່ສົ່ງມາຈາກ Frontend
    const selectedDate = searchParams.get('selectedDate');   // ຮູບແບບ 'YYYY-MM-DD'
    const selectedMonth = searchParams.get('selectedMonth'); // ຮູບແບບ 'YYYY-MM'

    const now = new Date();

    // [1]. Query Summary ສໍາລັບ Cards (ຄືເກົ່າ)
    const [daily, weekly, monthly, yearly] = await Promise.all([
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: startOfDay(now) } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: startOfWeek(now, { weekStartsOn: 1 }) } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: startOfMonth(now) } } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: startOfYear(now) } } }),
    ]);

    // [2]. Logic ສໍາລັບກາຟ ປະມວນຜົນຕາມຄ່າ `period` (ຄືເກົ່າ)
    let startDate: Date;
    let endDate: Date;
    let history: { date: string; sales: number }[] = [];
    const laoDays = ["ອາທິດ", "ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ"];
    const laoMonths = ["ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມິຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ"];

    if (period === 'yearly') {
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true, totalAmount: true },
      });
      const monthsInterval = eachMonthOfInterval({ start: startDate, end: endDate });
      history = monthsInterval.map((month) => {
        const monthSales = orders
          .filter((o) => format(o.createdAt, 'yyyy-MM') === format(month, 'yyyy-MM'))
          .reduce((sum, o) => sum + o.totalAmount, 0);
        return { date: laoMonths[month.getMonth()], sales: monthSales };
      });
    } else {
      let daysInterval: Date[];
      const isMonthlyView = period === 'monthly';
      if (isMonthlyView) {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
      } else {
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
      }
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true, totalAmount: true },
      });
      daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
      history = daysInterval.map((day) => {
        const daySales = orders
          .filter((o) => format(o.createdAt, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
          .reduce((sum, o) => sum + o.totalAmount, 0);
        return { date: isMonthlyView ? format(day, 'd') : laoDays[day.getDay()], sales: daySales };
      });
    }

    // [3]. Logic ສໍາລັບສິນຄ້າຂາຍດີ (ອີງຕາມ Filter ຂອງກາຟ)
    const orderItems = await prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: startDate, lte: endDate } } },
      include: { product: { include: { category: true } } }
    });

    const productMap: { [key: string]: { name: string; category: string; type: string; quantity: number; revenue: number } } = {};
    orderItems.forEach(item => {
      const name = item.product?.name || 'ເມນູທົ່ວໄປ';
      const category = item.product?.category?.name || 'ທົ່ວໄປ';
      const type = (item as any).type || 'ເຢັນ'; 
      const key = `${name}-${type}`;
      if (!productMap[key]) productMap[key] = { name, category, type, quantity: 0, revenue: 0 };
      productMap[key].quantity += item.quantity;
      productMap[key].revenue += (item.price || item.product?.price || 0) * item.quantity;
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // ==========================================
    // 🚀 ອັບເດດ LOGIC ໃໝ່: ຮອງຮັບການກອງປະຫວັດການຂາຍແບບເລືອກວັນທີ/ເດືອນອິດສະຫຼະ
    // ==========================================
    let historyStart: Date = startOfDay(now);
    let historyEnd: Date = now;

    if (historyPeriod === 'weekly') {
      historyStart = startOfWeek(now, { weekStartsOn: 1 });
      historyEnd = endOfWeek(now, { weekStartsOn: 1 });
    } else if (historyPeriod === 'monthly') {
      historyStart = startOfMonth(now);
      historyEnd = endOfMonth(now);
    } else if (historyPeriod === 'custom_date' && selectedDate) {
      // 📅 ກໍລະນີເລືອກວັນທີເຈາະຈົງ (ເຊັ່ນ: 2026-05-31)
      historyStart = new Date(selectedDate);
      historyStart.setHours(0, 0, 0, 0); // ຕັ້ງແຕ່ເວລາ 00:00 ໂມງ

      historyEnd = new Date(selectedDate);
      historyEnd.setHours(23, 59, 59, 999); // ຈົນຮອດເວລາ 23:59 ໂມງ
    } else if (historyPeriod === 'custom_month' && selectedMonth) {
      // 📅 ກໍລະນີເລືອກເດືອນເຈາະຈົງ (ເຊັ່ນ: 2026-05)
      const [year, month] = selectedMonth.split('-').map(Number);
      
      // ວັນທີ 1 ຂອງເດືອນນັ້ນ ເວລາ 00:00 ໂມງ
      historyStart = new Date(year, month - 1, 1, 0, 0, 0, 0);
      
      // ວັນສຸດທ້າຍ ຂອງເດືອນນັ້ນ ເວລາ 23:59 ໂມງ
      historyEnd = new Date(year, month, 0, 23, 59, 59, 999); 
    } else {
      // Default ແມ່ນ 'daily' (ມື້ນີ້)
      historyStart = startOfDay(now);
      historyEnd = now;
    }

    // ຄົ້ນຫາ Orders ຕາມຊ່ວງເວລາທີ່ຖືກກອງໄວ້
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: historyStart,
          lte: historyEnd
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: { include: { category: true } } }
        }
      }
    });

    const formattedRecentOrders = recentOrders.map(order => {
      const categoriesSet = new Set(
        order.items.map(item => item.product?.category?.name || 'ທົ່ວໄປ')
      );
      return {
        id: order.id,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        category: Array.from(categoriesSet).join(', '),
        items: order.items.map(item => ({
          productName: item.product?.name || 'ບໍ່ມີຊື່ເມນູ',
          quantity: item.quantity
        }))
      };
    });

    return NextResponse.json({
      summary: {
        daily: daily._sum.totalAmount || 0,
        weekly: weekly._sum.totalAmount || 0,
        monthly: monthly._sum.totalAmount || 0,
        yearly: yearly._sum.totalAmount || 0,
      },
      history,
      topProducts,
      recentOrders: formattedRecentOrders
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}