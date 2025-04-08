import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const password = await hash('password123', 12);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Smith',
      password,
      age: 25,
      gender: 'female',
      location: 'New York',
      occupation: 'Software Engineer',
      bio: 'Love hiking and photography',
      interests: ['hiking', 'photography', 'travel', 'music'],
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
      password,
      age: 28,
      gender: 'male',
      location: 'San Francisco',
      occupation: 'Product Manager',
      bio: 'Tech enthusiast and coffee lover',
      interests: ['technology', 'coffee', 'reading', 'travel'],
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 