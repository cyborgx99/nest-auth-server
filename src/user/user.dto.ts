import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class UserWithoutSensitiveInformation {
  id: string;
  email: string;
  name: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
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

  hashedRt?: string;
}
