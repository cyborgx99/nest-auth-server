import { User, UserRole } from '@prisma/client';

export const authSuccessResponse = { accessToken: 'jwtToken' };

export const createUserMDtoMock = {
  email: 'cyborgx999@gmail.com',
  password: '123qwe',
  name: 'John',
  lastName: 'Doe',
};

export const createUserResponseMock = {
  ...createUserMDtoMock,
  id: '1',
  role: UserRole.USER,
  createdAt: new Date('10-10-2022'),
  updatedAt: new Date('10-10-2022'),
  refreshTokens: [],
};

export const users: User[] = [
  {
    id: '1',
    name: 'Bong',
    lastName: 'Johnson',
    email: 'bong@gmail.com',
    password: '123qwe',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    refreshTokens: [],
  },
  {
    id: '2',
    name: 'John',
    lastName: 'Demonios',
    email: 'demon@gmail.com',
    password: '123qwe',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    refreshTokens: [],
  },
];
