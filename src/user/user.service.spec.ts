import { Test, TestingModule } from '@nestjs/testing';

import {
  createUserMDtoMock,
  createUserResponseMock,
  users,
} from 'src/mocks/user';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(() => {
        return users[0];
      }),
      create: jest.fn(() => {
        return createUserResponseMock;
      }),
      update: jest.fn(({ data }) => {
        return {
          ...users[0],
          name: data.name,
        };
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaClient },
      ],
    }).compile();

    userService = module.get(UserService);
  });

  it('findUserById returns the user', async () => {
    const user = await userService.findUserById(users[0].id);

    expect(user).toEqual(users[0]);

    expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: users[0].id,
      },
    });
  });

  it('Creates a user', async () => {
    const user = await userService.createUser(createUserMDtoMock);

    expect(user).toEqual(createUserResponseMock);

    expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
      data: createUserMDtoMock,
    });
  });

  it('Updates a user', async () => {
    const newName = 'New Name';

    const user = await userService.updateUser(users[0].id, {
      name: newName,
    });

    expect(user.name).toEqual(newName);

    expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
      data: {
        name: newName,
      },
      where: {
        id: users[0].id,
      },
    });
  });
});
