import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authConfig from '../configuration/authConfig';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly auth: ConfigType<typeof authConfig>,
    private readonly userService: UsersService,
  ) {
    const secret = auth.secret;
    if (!secret) throw new Error('JWT_TOKEN_SECRET is not defined!!');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const sessionId = payload.sessionId;
    const user = await this.userService.validateJwtUser(userId);

    return {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };
  }
}
