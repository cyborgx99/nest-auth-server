import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CookieNames, EnvNames, StrategyNames } from 'src/common/constants';
import { AuthorizedUser } from 'src/user/user.dto';
import { DecodedTokenPayload } from '../dto/auth.dto';

@Injectable()
export class RefrestTokenStrategy extends PassportStrategy(
  Strategy,
  StrategyNames.JWT_REFRESH,
) {
  constructor(config: ConfigService) {
    super({
      ignoreExpriation: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          console.log(req.cookies);
          let token = null;
          if (req && req.cookies) {
            token = req.cookies[CookieNames.JWT];
          }
          return token;
        },
      ]),
      secretOrKey: config.get(EnvNames.REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: DecodedTokenPayload) {
    const user: AuthorizedUser = { id: payload.id };
    const refreshToken = req.cookies[CookieNames.JWT];

    const userWithRefreshToken: AuthorizedUser = {
      refreshToken,
      ...user,
    };

    return userWithRefreshToken;
  }
}
