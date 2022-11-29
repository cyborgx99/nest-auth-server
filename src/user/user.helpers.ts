import { User } from '@prisma/client';
import { UserWithoutSensitiveInformation } from './user.dto';

export const userToUserWithoutSensitiveInformation = (
  user: User,
): UserWithoutSensitiveInformation => {
  return {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    id: user.id,
    role: user.role,
  };
};
