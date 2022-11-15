import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MetadataNames, StrategyNames } from '../constants';

@Injectable()
export class AuthTokenGuard extends AuthGuard(StrategyNames.JWT) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(MetadataNames.isPublic, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    } else {
      return super.canActivate(context);
    }
  }
}
