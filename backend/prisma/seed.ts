import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: 'Read a book',
        description: 'Count of Monte Cristo',
        status: 'OPEN',
      },
      {
        title: 'Clean bedroom',
        description: 'sweep',
        status: 'OPEN',
      },
      {
        title: 'Mow the lawn',
        description: 'kerosene',
        status: 'OPEN',
      },
      {
        title: 'Watch a movie',
        description: 'Jurrasic Park',
        status: 'OPEN',
      },
      {
        title: 'Assignment',
        description: 'Submission 16th',
        status: 'OPEN',
      },
      {
        title: 'Buy groceries',
        description: 'apples, oranges, milk',
        status: 'OPEN',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
