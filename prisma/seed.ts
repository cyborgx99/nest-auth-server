import { PrismaClient } from '@prisma/client';
import { seedUser } from './user.seed';

const prisma = new PrismaClient();

async function main() {
  seedUser(prisma);
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
