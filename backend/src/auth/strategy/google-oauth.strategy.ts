import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('googleOauth.clientId'),
      clientSecret: configService.getOrThrow<string>('googleOauth.secret'),
      callbackURL: configService.getOrThrow<string>('googleOauth.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = await this.userService.findUserByEmail(
      profile.emails?.[0].value,
    );

    if (!user) throw new UnauthorizedException('User not found.');

    done(null, {
      email: profile.emails?.[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      avatarUrl: profile.photos[0].value,
      googleId: profile.id,
      role: user.role,
    });
  }
}
