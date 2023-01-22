import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AuthSuccessResponse,
  SignInDto,
  SignUpDto,
  SuccessResponse,
  TokenPayload,
  Tokens,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CookieNames, cookieOptions, EnvNames } from 'src/common/constants';

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
    secret: this.config.get(EnvNames.ACCESS_TOKEN_SECRET),
  };

  refreshTokenOptions: JwtSignOptions = {
    expiresIn: '3d',
    secret: this.config.get(EnvNames.REFRESH_TOKEN_SECRET),
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

  async signUp(res: Response, data: SignUpDto): Promise<AuthSuccessResponse> {
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

    res.cookie(CookieNames.JWT, tokens.refreshToken, cookieOptions);

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

    res.cookie(CookieNames.JWT, tokens.refreshToken, cookieOptions);

    return { accessToken: tokens.accessToken };
  }

  async logout(res: Response, jwtCookie: string): Promise<SuccessResponse> {
    if (!jwtCookie) throw new UnauthorizedException();

    const user = await this.userService.findUserByRefreshToken(jwtCookie);

    if (!user) {
      res.clearCookie(CookieNames.JWT, cookieOptions);
      return { success: true };
    }

    const newRefreshTokenArray = user.refreshTokens.filter(
      (rt) => rt !== jwtCookie,
    );

    await this.userService.updateUser(user.id, {
      refreshTokens: newRefreshTokenArray,
    });

    res.clearCookie(CookieNames.JWT, cookieOptions);

    return { success: true };
  }

  async refresh(
    res: Response,
    refreshToken: string | undefined,
  ): Promise<AuthSuccessResponse> {
    res.clearCookie(CookieNames.JWT, cookieOptions);

    if (!refreshToken) {
      throw new ForbiddenException();
    }

    const foundUserByRefreshToken =
      await this.userService.findUserByRefreshToken(refreshToken);

    try {
      const decodedToken = this.jwtService.verify(refreshToken, {
        secret: this.config.get(EnvNames.REFRESH_TOKEN_SECRET),
      });

      // Detected refresh token reuse!
      if (!foundUserByRefreshToken) {
        await this.userService.updateUser(decodedToken.id, {
          refreshTokens: [],
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
