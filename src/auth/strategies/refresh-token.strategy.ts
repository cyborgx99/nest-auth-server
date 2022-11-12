import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefrestTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refrest',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    // return stuff
    // req.user  = stuff
    return {
      refreshToken,
      ...payload,
    };
  }
}
