import { PrismaClient } from '@prisma/client';
import { seedCategories } from './categories.seed';
import { seedItems } from './item.seed';
import { seedUser } from './user.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUser(prisma);
  await seedCategories(prisma);
  await seedItems(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
