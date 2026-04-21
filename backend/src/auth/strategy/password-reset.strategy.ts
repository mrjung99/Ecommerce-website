import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import passwordResetConfig from '../configuration/password-reset.config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PasswordResetStrategy extends PassportStrategy(
  Strategy,
  'jwt-password-reset',
) {
  constructor(
    @Inject(passwordResetConfig.KEY)
    private readonly resetPassConfig: ConfigType<typeof passwordResetConfig>,
    private readonly userService: UsersService,
  ) {
    const secret = resetPassConfig.secret;
    if (!secret) throw new Error('JWT_RESET_PASS_SECRET is not defined.');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: {
    sub: string;
    role: string;
    email: string;
    type: string;
  }) {
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    if (payload.type !== 'password-reset') {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
