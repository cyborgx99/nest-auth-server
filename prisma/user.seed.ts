import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const users: Prisma.UserCreateManyInput[] = [
  {
    name: 'Bong',
    lastName: 'Johnson',
    email: 'bong@gmail.com',
    password: '123qwe',
  },
  {
    name: 'John',
    lastName: 'Demonios',
    email: 'demon@gmail.com',
    password: '123qwe',
  },
];

export const seedUser = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >,
) => {
  const usersWithHashedPassword: Prisma.UserCreateManyInput[] =
    await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          password: await bcrypt.hash(user.password, 10),
        };
      }),
    );

  await prisma.user.createMany({
    data: usersWithHashedPassword,
  });
};
