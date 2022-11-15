import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthorizedUser } from 'src/user/user.dto';

export const CurrentUser = createParamDecorator(
  (key: keyof AuthorizedUser, context: ExecutionContext): AuthorizedUser => {
    const request = context.switchToHttp().getRequest();
    if (!key) return <AuthorizedUser>request.user;
    return request.user[key];
  },
);
