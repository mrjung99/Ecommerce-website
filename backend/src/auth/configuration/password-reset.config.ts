import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'reset-pass',
  (): JwtSignOptions => ({
    secret: process.env.JWT_PASSWORD_RESET_SECRET,
    expiresIn: '15m',
  }),
);
