import { Inject, Injectable } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import authConfig from "../config/authConfig";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      @Inject(authConfig.KEY)
      private readonly auth: ConfigType<typeof authConfig>,
      private readonly userService: UserService
   ) {
      const secret = auth.secret;
      if (!secret) {
         throw new Error("JWT_SECRET_TOKEN is not defined!!")
      }

      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: secret,
         ignoreExpiration: false
      })
   }

   async validate(payload: any) {
      const userId = payload.sub;
      return await this.userService.validateJwtUser(userId)
   }
}