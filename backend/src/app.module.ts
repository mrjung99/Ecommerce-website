import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/dbConfig';
import appEnvConfig from './config/appEnv.config';
import validationConfig from './config/validationConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from './auth/config/authConfig';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt.auth.guard';
import { ProductImageModule } from './product-image/product-image.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { CartModule } from './cart/cart.module';

const env = process.env.NODE_ENV
console.log(`Currently in ${env?.trim()} mode`);


@Module({
   imports: [
      ConfigModule.forRoot(
         {
            envFilePath: !env ? '.env' : `.env.${env.trim()}.local`,
            load: [dbConfig, appEnvConfig, authConfig],
            isGlobal: true,
            validationSchema: validationConfig
         }
      ),
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: (appConfig: ConfigService) => ({
            type: 'postgres',
            synchronize: appConfig.get('database.synchronize'),
            autoLoadEntities: appConfig.get('database.autoLoadEntities'),
            username: appConfig.get('database.username'),
            password: appConfig.get('database.password'),
            database: appConfig.get('database.name'),
            host: appConfig.get('database.host'),
            port: appConfig.get('database.port')
         })
      }),
      AuthModule,
      UserModule,
      ProductModule,
      CategoryModule,
      OrderModule,
      PaymentModule,
      ProfileModule,
      ProductImageModule,
      CloudinaryModule,
      CartModule,
      CartItemModule
   ],
   controllers: [AppController],
   providers: [AppService,
      {
         provide: APP_GUARD,
         useClass: JwtAuthGuard
      }
   ],
})
export class AppModule { }
