import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { authSuccessResponse, createUserMDtoMock, users } from 'src/mocks/user';
import { UserWithoutSensitiveInformation } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockRes = {} as Response;
  const mockUserService = {
    findUserById: jest.fn((id: string) => {
      return users.find((user) => user.id === id);
    }),
  };
  const mockAuthService = {
    signUp: jest.fn(() => {
      return authSuccessResponse;
    }),
    signIn: jest.fn(() => {
      return authSuccessResponse;
    }),
    refresh: jest.fn(() => {
      return authSuccessResponse;
    }),
    logout: jest.fn(() => {
      return { success: true };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [UserService, AuthService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Should receive access token after signing up', () => {
    expect(controller.signUp(mockRes, createUserMDtoMock)).toEqual({
      accessToken: expect.any(String),
    });

    expect(mockAuthService.signUp).toHaveBeenCalledWith(
      mockRes,
      createUserMDtoMock,
    );
  });

  it('Should receive access token after signing in', () => {
    expect(controller.signIn(mockRes, createUserMDtoMock)).toEqual({
      accessToken: expect.any(String),
    });

    expect(mockAuthService.signIn).toHaveBeenCalledWith(
      mockRes,
      createUserMDtoMock,
    );
  });

  it('Should receive access token after refreshing', () => {
    expect(
      controller.refresh(mockRes, { id: '1', refreshToken: 'refreshToken' }),
    ).toEqual({
      accessToken: expect.any(String),
    });

    expect(mockAuthService.refresh).toHaveBeenCalledWith(
      mockRes,
      'refreshToken',
    );
  });

  it('Should get current user without sensitive information', async () => {
    const user = await controller.getCurrentUser({ id: users[0].id });

    const mockUserWithoutSensitiveInformation: UserWithoutSensitiveInformation =
      {
        name: users[0].name,
        lastName: users[0].lastName,
        email: users[0].email,
        id: users[0].id,
        role: users[0].role,
      };

    expect(user).toEqual(mockUserWithoutSensitiveInformation);
    expect(mockUserService.findUserById).toHaveBeenCalledWith(users[0].id);
  });

  it('Should log user out ', () => {
    expect(controller.logout(mockRes, 'jwtCookie')).toEqual({
      success: true,
    });

    expect(mockAuthService.logout).toHaveBeenCalledWith(mockRes, 'jwtCookie');
  });
});
