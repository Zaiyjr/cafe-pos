import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // ດຶງຂໍ້ມູນສິນຄ້າທັງໝົດ ທີ່ພ້ອມຂາຍ (isAvailable: true)
    const products = await prisma.product.findMany({
      include: {category: true},
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('GET_PRODUCTS_ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 2. POST: ເພີ່ມສິນຄ້າໃໝ່
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, categoryId, description } = body;

    // Validation ຂໍ້ມູນເບື້ອງຕົ້ນ
    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId,
        description,
        image: '/images/default-coffee.png', // ກຳນົດຮູບ Default ໄປກ່ອນ
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('CREATE_PRODUCT_ERROR:', error);
    return NextResponse.json({ error: 'ບໍ່ສາມາດເພີ່ມສິນຄ້າໄດ້' }, { status: 500 });
  }
}