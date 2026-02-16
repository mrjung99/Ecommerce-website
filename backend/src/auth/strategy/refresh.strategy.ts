import type { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import refreshConfig from "../config/refreshConfig";
import { Inject, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../auth.service";


export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
   constructor(
      @Inject(refreshConfig.KEY)
      private readonly refreshConfiguration: ConfigType<typeof refreshConfig>,
      private readonly authService: AuthService
   ) {
      const secret = refreshConfiguration.secret;
      if (!secret) throw new Error("JWT_REFRESH_TOKEN not defined!!")
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: secret,
         ignoreExpiration: false,
         passReqToCallback: true
      })
   }


   async validate(req: Request, payload: any) {
      const userId = payload.sub;
      const refreshToken = req.headers.authorization?.split(' ')[1];

      if (!refreshToken) {
         throw new UnauthorizedException()
      }

      return await this.authService.compareRefreshToken(userId, refreshToken);
   }
}