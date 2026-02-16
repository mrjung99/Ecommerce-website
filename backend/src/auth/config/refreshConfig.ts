import { registerAs } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";



export default registerAs('refresh-jwt', (): JwtSignOptions => ({
   secret: process.env.REFRESH_TOKEN_SECRET,
   audience: process.env.REFRESH_TOKEN_AUDIENCE,
   expiresIn: '7d',
   issuer: process.env.REFRESH_TOKEN_ISSUER
}))