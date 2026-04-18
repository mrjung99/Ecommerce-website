import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import authConfig from './configuration/authConfig';
import { ConfigModule } from '@nestjs/config';
import refreshConfig from './configuration/refreshConfig';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../otp/otp.module';
import { SessionModule } from '../session/session.module';
import passwordResetConfig from './configuration/password-reset.config';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync(authConfig.asProvider()),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(passwordResetConfig),
    MailModule,
    OtpModule,
    SessionModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
