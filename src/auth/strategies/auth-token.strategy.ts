import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvNames, StrategyNames } from 'src/common/constants';
import { AuthorizedUser } from 'src/user/user.dto';
import { DecodedTokenPayload } from '../dto/auth.dto';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyNames.JWT,
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(EnvNames.ACCESS_TOKEN_SECRET),
    });
  }

  validate(payload: DecodedTokenPayload) {
    const user: AuthorizedUser = { id: payload.id };
    return user;
  }
}
