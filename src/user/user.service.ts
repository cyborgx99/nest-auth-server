import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { SignUpDto } from 'src/auth/dto/auth.dto';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  createUser(createUserDto: SignUpDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
    });
  }

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}