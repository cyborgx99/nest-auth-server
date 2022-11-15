import { CookieOptions } from 'express';
import * as Joi from 'joi';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
});

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
