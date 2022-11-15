import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyNames } from '../constants';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(StrategyNames.JWT_REFRESH) {
  constructor() {
    super();
  }
}
