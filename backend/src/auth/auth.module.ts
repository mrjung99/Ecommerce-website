import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import authConfig from './configuration/authConfig';
import { ConfigModule } from '@nestjs/config';
import refreshConfig from './configuration/refreshConfig';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from '../users/entities/password-reset.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PasswordReset]),
    JwtModule.registerAsync(authConfig.asProvider()),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(refreshConfig),
    MailModule,
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
