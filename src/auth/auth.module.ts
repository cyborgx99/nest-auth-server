import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { AuthTokenStrategy, RefrestTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    AuthTokenStrategy,
    RefrestTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
