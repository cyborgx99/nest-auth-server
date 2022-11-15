import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class AuthorizedUser {
  id: string;
  refreshToken?: string;
}

export class UpdateUserDto {
  @IsEmail()
  email?: string;
  @MinLength(6)
  password?: string;
  @MinLength(2)
  @MaxLength(32)
  name?: string;
  @MinLength(2)
  @MaxLength(32)
  lastName?: string;

  refreshTokens: string[];
}
