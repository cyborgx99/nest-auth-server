import { CookieOptions } from 'express';
import * as Joi from 'joi';

export enum MetadataNames {
  isPublic = 'isPublic',
}

export enum StrategyNames {
  JWT = 'JWT',
  JWT_REFRESH = 'JWT_REFRESH',
}

export enum CookieNames {
  JWT = 'JWT',
}

export enum EnvNames {
  PORT = 'PORT',
  DATABASE_URL = 'DATABASE_URL',
  ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET',
  REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET',
}

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

export const configValidationSchema = Joi.object({
  [EnvNames.PORT]: Joi.number().default(3001),
  [EnvNames.DATABASE_URL]: Joi.string().required(),
  [EnvNames.ACCESS_TOKEN_SECRET]: Joi.string().required(),
  [EnvNames.REFRESH_TOKEN_SECRET]: Joi.string().required(),
});
