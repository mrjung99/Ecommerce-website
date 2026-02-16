import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import authConfig from './config/authConfig';
import { ConfigModule } from '@nestjs/config';
import refreshConfig from './config/refreshConfig';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';

@Module({
   imports: [
      UserModule,
      ConfigModule.forFeature(refreshConfig),
      JwtModule.registerAsync(authConfig.asProvider())
   ],

   controllers: [AuthController],

   providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})

export class AuthModule { }
