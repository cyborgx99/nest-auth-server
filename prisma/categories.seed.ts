import { Prisma, PrismaClient } from '@prisma/client';

export const categories: Prisma.CategoryCreateManyInput[] = [
  {
    name: 'Meat',
  },
  {
    name: 'Drinks',
  },
  {
    name: 'Soups',
  },
];

export const seedCategories = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >,
) => {
  return prisma.category.createMany({
    data: categories,
  });
};
