import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Product } from '../products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { Profile } from '../profile/entities/profile.entity';
import { PaymentModule } from '../payment/payment.module';
import { ProfileModule } from '../profile/profile.module';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      Payment,
      Product,
      OrderItem,
      Profile,
    ]),
    PaymentModule,
    ProfileModule,
    CartModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
