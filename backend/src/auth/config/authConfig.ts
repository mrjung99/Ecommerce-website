import { registerAs } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";

export default registerAs('auth', (): JwtSignOptions => ({
   secret: process.env.JWT_TOKEN_SECRET,
   audience: process.env.JWT_TOKEN_AUDIENCE,
   expiresIn: '5m',
   issuer: process.env.JWT_TOKEN_ISSUER
}))