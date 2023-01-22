import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Get,
  NotFoundException,
} from '@nestjs/common';
import {
  AuthSuccessResponse,
  SignInDto,
  SignUpDto,
  SuccessResponse,
} from './dto/auth.dto';
import { AuthService } from './auth.service';
import {
  AuthorizedUser,
  UserWithoutSensitiveInformation,
} from 'src/user/user.dto';
import { RefreshTokenGuard } from 'src/common/guards';
import { CurrentUser, Public } from 'src/common/decorators';
import { Response } from 'express';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { CookieNames } from 'src/common/constants';
import { UserService } from 'src/user/user.service';
import { userToUserWithoutSensitiveInformation } from 'src/user/user.helpers';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('sign-up')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signUpDto: SignUpDto,
  ): Promise<AuthSuccessResponse> {
    return this.authService.signUp(res, signUpDto);
  }

  @Get('current-user')
  async getCurrentUser(
    @CurrentUser() user: AuthorizedUser,
  ): Promise<UserWithoutSensitiveInformation> {
    const foundUser = await this.userService.findUserById(user.id);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const userWithoutSensitiveInformation =
      userToUserWithoutSensitiveInformation(foundUser);

    return userWithoutSensitiveInformation;
  }

  @Post('sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: SignInDto,
  ): Promise<AuthSuccessResponse> {
    return this.authService.signIn(res, signInDto);
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  logout(
    @Res({ passthrough: true }) res: Response,
    @Cookies(CookieNames.JWT) jwtCookie: string,
  ): Promise<SuccessResponse> {
    return this.authService.logout(res, jwtCookie);
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: AuthorizedUser,
  ): Promise<AuthSuccessResponse> {
    return this.authService.refresh(res, user.refreshToken);
  }
}
