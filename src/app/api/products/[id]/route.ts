import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. PUT: ແກ້ໄຂຂໍ້ມູນສິນຄ້າ
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // 🚀 ແກ້ໄຂການດຶງ params ໃຫ້ປອດໄພ ຮອງຮັບ Next.js ທຸກເວີຊັນ
    const resolvedParams = 'then' in params ? await params : params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'ບໍ່ພົບ ID ຂອງສິນຄ້າ' }, { status: 400 });
    }

    const body = await req.json();
    const { name, price, categoryId, description, image } = body;

    // ກວດສອບຄວາມຖືກຕ້ອງຂອງລາຄາ (ປ້ອງກັນການສົ່ງຄ່າທີ່ບໍ່ແມ່ນຕົວເລກ)
    const parsedPrice = typeof price === 'number' ? price : parseFloat(price);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parsedPrice,
        categoryId,
        description,
        image,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error('❌ UPDATE_PRODUCT_ERROR:', error);
    return NextResponse.json({ error: 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນສິນຄ້າໄດ້' }, { status: 500 });
  }
}

// 2. DELETE: ລົບສິນຄ້າ
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // 🚀 ແກ້ໄຂການດຶງ params ໃຫ້ປອດໄພ ຮອງຮັບ Next.js ທຸກເວີຊັນ
    const resolvedParams = 'then' in params ? await params : params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'ບໍ່ພົບ ID ຂອງສິນຄ້າ' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'ລົບສິນຄ້າສຳເລັດ' }, { status: 200 });
  } catch (error: any) {
    console.error('❌ DELETE_PRODUCT_ERROR:', error);
    return NextResponse.json({ error: 'ບໍ່ສາມາດລົບສິນຄ້າໄດ້' }, { status: 500 });
  }
}