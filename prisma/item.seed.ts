import { Prisma, PrismaClient } from '@prisma/client';

export const seedItems = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: 'bong@gmail.com',
    },
  });

  const categories = await prisma.category.findMany({});

  const items: Prisma.ItemCreateInput[] = [
    {
      title: 'Fried Chicken',
      imageUrl:
        'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80',
      price: 20,
      creator: {
        connect: {
          id: user?.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: categories.find((category) => category.name === 'Meat')?.id,
            },
          },
        },
      },
    },
    {
      title: 'Sprite',
      imageUrl:
        'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
      price: 10,
      creator: {
        connect: {
          id: user?.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: categories.find((category) => category.name === 'Drinks')?.id,
            },
          },
        },
      },
    },
    {
      title: 'Ogórkowa',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Cucumber_soup.jpg/800px-Cucumber_soup.jpg',
      price: 15,
      creator: {
        connect: {
          id: user?.id,
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              id: categories.find((category) => category.name === 'Soups')?.id,
            },
          },
        },
      },
    },
  ];

  return Promise.all(
    items.map(async (item) => {
      await prisma.item.create({
        data: item,
      });
    }),
  );
};
