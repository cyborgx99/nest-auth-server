import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(2)
  @MaxLength(32)
  name: string;

  @MinLength(2)
  @MaxLength(32)
  lastName: string;

  @MinLength(6)
  password: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}

export class ValidateUserDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}

export class UpdateRefreshTokenDto {
  userId: string;
  refreshToken: string;
}

export class Tokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthSuccessResponse {
  accessToken: string;
}

export class SuccessResponse {
  success: boolean;
}

export class TokenPayload {
  id: string;
}

export class DecodedTokenPayload {
  id: string;
  iat: number;
  exp: number;
}
