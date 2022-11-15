import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AuthSuccessResponse,
  SignInDto,
  SignUpDto,
  TokenPayload,
  Tokens,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CookieNames, cookieOptions } from 'src/common/constants';

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

  async generateTokens(payload: TokenPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, this.accessTokenOptions),
      this.signToken(payload, this.refreshTokenOptions),
    ]);

    return { accessToken, refreshToken };
  }

  signToken(payload: TokenPayload, options: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  compareDataWithHash(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  async signUp(data: SignUpDto): Promise<AuthSuccessResponse> {
    const hashedPassword = await this.hashData(data.password);

    const dtoWithHashedPassword: SignUpDto = {
      ...data,
      password: hashedPassword,
    };

    const user = await this.userService.createUser(dtoWithHashedPassword);
    const payload: TokenPayload = { id: user.id };

    const tokens = await this.generateTokens(payload);

    await this.userService.updateUser(user.id, {
      refreshTokens: [...user.refreshTokens, tokens.refreshToken],
    });

    return { accessToken: tokens.accessToken };
  }

  async signIn(
    res: Response,
    signInDto: SignInDto,
  ): Promise<AuthSuccessResponse> {
    const user = await this.userService.findUserByEmail(signInDto.email);

    if (
      !user ||
      !(await this.compareDataWithHash(signInDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = { id: user.id };

    const tokens = await this.generateTokens(payload);

    await this.userService.updateUser(user.id, {
      refreshTokens: [...user.refreshTokens, tokens.refreshToken],
    });

    res.cookie(CookieNames.JWT, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  async logout(userId: string) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        refreshTokens: { isEmpty: false },
      },
      data: {
        refreshTokens: [],
      },
    });
  }

  async refresh(
    res: Response,
    refreshToken: string,
  ): Promise<AuthSuccessResponse> {
    res.clearCookie(CookieNames.JWT, cookieOptions);

    const foundUserByRefreshToken = await this.prismaService.user.findFirst({
      where: {
        refreshTokens: {
          has: refreshToken,
        },
      },
    });

    try {
      const decodedToken = this.jwtService.verify(refreshToken, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });

      // Detected refresh token reuse!
      if (!foundUserByRefreshToken) {
        await this.prismaService.user.update({
          where: {
            id: decodedToken.id,
          },
          data: {
            refreshTokens: [],
          },
        });

        throw new ForbiddenException();
      }

      const newRefreshTokenArray = foundUserByRefreshToken.refreshTokens.filter(
        (rt) => rt !== refreshToken,
      );

      const payload: TokenPayload = { id: foundUserByRefreshToken.id };

      const tokens = await this.generateTokens(payload);

      await this.userService.updateUser(foundUserByRefreshToken.id, {
        refreshTokens: [...newRefreshTokenArray, tokens.refreshToken],
      });

      res.cookie(CookieNames.JWT, tokens.refreshToken, cookieOptions);

      return { accessToken: tokens.accessToken };
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
