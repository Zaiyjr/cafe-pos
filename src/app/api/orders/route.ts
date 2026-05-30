import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount } = body; // ຮັບຄ່າ items ແລະ ຍອດລວມມາຈາກ Frontend

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'ຕະກ້າສິນຄ້າຫວ່າງເປົ່າ' }, { status: 400 });
    }

    // 1. ສ້າງເລກທີໃບບິນແບບອັດຕະໂນມັດ (ເຊັ່ນ: CAF-20260528-1234)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CAF-${dateStr}-${randomNum}`;

    // 2. ໃຊ້ $transaction ຂອງ Prisma ເພື່ອບັນທຶກ Order ແລະ OrderItem ພ້ອມກັນ
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          totalAmount: totalAmount,
          finalAmount: totalAmount, // ຖ້າມີສ່ວນຫຼຸດຈຶ່ງເອົາມາລົບອອກທີຫຼັງ
          paymentMethod: 'CASH',    // ຄ່າເລີ່ມຕົ້ນເປັນເງິນສົດ
          status: 'COMPLETED',
          // ເນື່ອງຈາກເຮົາໃຊ້ Schema ໂຕທຳອິດ (ບໍ່ມີ User/Customer), ຂໍ້ມູນຈຶ່ງມີເທົ່ານີ້
        },
      });

      // 3. ບັນທຶກລາຍການສິນຄ້າແຕ່ລະຊິ້ນທີ່ຢູ່ໃນຕະກ້າ ຜູກເຂົ້າກັບ ID ຂອງ Order ມື້ກີ້
      const orderItemsData = items.map((item: any) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price, // ບັນທຶກລາຄາ ນະ ເວລາຂາຍ
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('CREATE_ORDER_ERROR:', error);
    return NextResponse.json({ error: 'ບໍ່ສາມາດບັນທຶກອໍເດີ້ໄດ້' }, { status: 500 });
  }
}