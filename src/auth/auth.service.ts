import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { SignUpDto, UpdateRefreshTokenDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload, Tokens } from './types';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from 'src/user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private config: ConfigService,
  ) {}

  accessTokenOptions: JwtSignOptions = {
    expiresIn: '15m',
    secret: this.config.get('ACCESS_TOKEN_SECRET'),
  };

  refreshTokenOptions: JwtSignOptions = {
    expiresIn: '3d',
    secret: this.config.get('REFRESH_TOKEN_SECRET'),
  };

  hashData(data: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(data, saltRounds);
  }

  async updateRefreshTokenHash(refreshTokenDto: UpdateRefreshTokenDto) {
    const refreshTokenHash = await this.hashData(refreshTokenDto.refreshToken);

    const updateUserDto: UpdateUserDto = {
      hashedRt: refreshTokenHash,
    };

    await this.userService.updateUser(refreshTokenDto.userId, updateUserDto);
  }

  signToken(payload: TokenPayload, options: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  comparePasswords(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async signUp(data: SignUpDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(data.password);

    const dtoWithHashedPassword: SignUpDto = {
      ...data,
      password: hashedPassword,
    };

    const user = await this.userService.createUser(dtoWithHashedPassword);
    const payload: TokenPayload = { id: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, this.accessTokenOptions),
      this.signToken(payload, this.refreshTokenOptions),
    ]);

    await this.updateRefreshTokenHash({ userId: user.id, refreshToken });

    return { accessToken, refreshToken };
  }

  async logout() {
    console.log(1);
  }

  async refresh() {
    console.log(1);
  }
}
