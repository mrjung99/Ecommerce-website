import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { ProfileModule } from 'src/profile/profile.module';
import { CartModule } from 'src/cart/cart.module';

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
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
