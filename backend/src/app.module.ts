import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.auth.guard';
import { ProductCategoryModule } from './product-category/product-category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import appConfiguration from './configuration/app.configuration';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';
import { SessionModule } from './session/session.module';
import mailConfiguration from './configuration/mail.configuration';
import envValidator from './configuration/env.validator';
import googleOauthConfig from './configuration/google-oauth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'}`,
      load: [
        appConfiguration,
        mailConfiguration,
        mailConfiguration,
        googleOauthConfig,
      ],
      validationSchema: envValidator,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = process.env.NODE_ENV === 'production';

        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,

          ...(isProd
            ? {
                url: configService.get<string>('database.url'),
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                username: configService.get<string>('database.userName'),
                password: configService.get<string>('database.password'),
                database: configService.get<string>('database.name'),
              }),
        };
      },
    }),
    MailModule,
    ProfileModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    PaginationModule,
    ProductCategoryModule,
    CartModule,
    OrderModule,
    PaymentModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 50 },
      { name: 'long', ttl: 900000, limit: 200 },
    ]),
    CloudinaryModule,
    OtpModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
