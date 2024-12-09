import { PrismaClient } from '@prisma/client';
import { todos } from './seeds/todos';
import { users } from './seeds/user';

const prisma = new PrismaClient();

/**
 * Seeds the database
 */
async function main() {
  await prisma.user.createMany({
    data: users,
  });

  await prisma.todo.createMany({
    data: todos,
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
