import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from './configuration/db.configuration';
import { ConfigModule } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.auth.guard';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env',
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    TypeOrmModule.forRoot(pgConfig),
    PaginationModule,
    ProfileModule,
    ImageUploadModule,
    ProductCategoryModule,
    CartModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
