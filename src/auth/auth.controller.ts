import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthSuccessResponse, SignInDto, SignUpDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthorizedUser } from 'src/user/user.dto';
import { RefreshTokenGuard } from 'src/common/guards';
import { CurrentUser, Public } from 'src/common/decorators';
import { Response } from 'express';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { CookieNames } from 'src/common/constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto): Promise<AuthSuccessResponse> {
    return this.authService.signUp(signUpDto);
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
  ) {
    return this.authService.logout(res, jwtCookie);
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @CurrentUser() user: AuthorizedUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(res, user.refreshToken);
  }
}
