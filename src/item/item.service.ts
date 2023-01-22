import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateItemDto } from './dto/item.dto';

@Injectable()
export class ItemService {
  constructor(private prismaService: PrismaService) {}

  itemDefaultInclude = {
    creator: true,
    categories: {
      include: {
        category: true,
      },
    },
  };

  createItem(data: CreateItemDto, creatorId: string) {
    const { categoryIds, ...rest } = data;

    const connectCategories =
      categoryIds.map((id) => {
        return {
          category: {
            connect: {
              id: id,
            },
          },
        };
      }) ?? [];

    return this.prismaService.item.create({
      data: {
        ...rest,
        creatorId,
        categories: {
          create: connectCategories,
        },
      },
      include: this.itemDefaultInclude,
    });
  }

  getAllItems() {
    return this.prismaService.item.findMany({
      include: this.itemDefaultInclude,
    });
  }
}
