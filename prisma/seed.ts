import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 10);

  await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {
      password: hashedPassword,
      name: 'ເຈົ້າຂອງຮ້ານ Demo',
    },
    create: {
      email: 'owner@demo.com',
      password: hashedPassword,
      name: 'ເຈົ້າຂອງຮ້ານ Demo',
    },
  });

  console.log('✅ Demo owner seeded: owner@demo.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
