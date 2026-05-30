import { NextResponse } from 'next/server';
import { prisma} from '@/lib/prisma' // ຫຼື ຕາມບ່ອນທີ່ເຈົ້າເກັບ prisma client ໄວ້ ເຊັ່ນ @/prisma/db

// GET: ດຶງປະເພດສິນຄ້າທັງໝົດ
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    console.error('❌ GET_CATEGORIES_ERROR:', error);
    return NextResponse.json({ error: 'ບໍ່ສາມາດດຶງຂໍ້ມູນປະເພດສິນຄ້າໄດ້' }, { status: 500 });
  }
}

// POST: ສ້າງປະເພດສິນຄ້າໃໝ່
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນຊື່ປະເພດ' }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { 
        name: name.trim() 
      },
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('❌ POST_CATEGORY_ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ' }, 
      { status: 500 }
    );
  }
}