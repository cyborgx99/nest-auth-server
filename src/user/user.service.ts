import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { SignUpDto } from 'src/auth/dto/auth.dto';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  createUser(createUserDto: SignUpDto): Promise<User> {
    return this.prismaService.user.create({ data: createUserDto });
  }

  updateUser(userId: string, userUpdateInput: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: userUpdateInput,
    });
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  findUserById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  findUserByRefreshToken(token: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        refreshTokens: {
          has: token,
        },
      },
    });
  }
}
