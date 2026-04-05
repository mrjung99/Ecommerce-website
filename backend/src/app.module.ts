import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './configuration/db.configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.auth.guard';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import appConfiguration from './configuration/app.configuration';
import envValidator from './configuration/validation.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfiguration],
      validationSchema: envValidator,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true, // remove while production
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.userName'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
      }),
    }),
    //  TypeOrmModule.forRoot(pgConfig), // for neon connection
    UsersModule,
    AuthModule,
    ProductsModule,
    PaginationModule,
    ProfileModule,
    ImageUploadModule,
    ProductCategoryModule,
    CartModule,
    OrderModule,
    PaymentModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 50 },
      { name: 'long', ttl: 900000, limit: 200 },
    ]),
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
