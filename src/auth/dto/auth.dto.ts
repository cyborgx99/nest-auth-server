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
