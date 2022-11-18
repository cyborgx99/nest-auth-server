import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CookieNames } from '../constants';

export type Cookies = {
  [key in CookieNames]: string;
};

export const Cookies = createParamDecorator(
  (key: CookieNames, context: ExecutionContext): Cookies | string => {
    const request: Request = context.switchToHttp().getRequest();
    const cookies = <Cookies>request.cookies;

    if (!key) return cookies;
    return cookies[key];
  },
);
