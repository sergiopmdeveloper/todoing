import { PrismaClient } from '@prisma/client';
import { users } from './seeds/user';

const prisma = new PrismaClient();

/**
 * Seeds the database
 */
async function main() {
  await prisma.user.createMany({
    data: users,
  });
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
