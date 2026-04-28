import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'auth',
  (): JwtSignOptions => ({
    secret: process.env.JWT_SECRET,
    expiresIn: '15m',
  }),
);
