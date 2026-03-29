import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentProvider } from 'src/payment/payment.provider';
import { Profile } from 'src/profile/entities/profile.entity';
import { patch } from 'axios';
import { OrderStatus } from 'src/common/enum/order-status.enum';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentMethod } from 'src/common/enum/payment-method.enum';
import { PaymentStatus } from 'src/common/enum/payment.status';
import { NotFoundError } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly paymentProvider: PaymentProvider,
    private readonly cartService: CartService,
  ) {}

  //* ---------------------- HELPER: resolve shipping address ------------------
  private async resolveShippingAddress(userId: string) {
    const profile = await this.profileRepo.findOne({
      where: { id: userId },
    });

    if (!profile) {
      throw new BadRequestException(
        'No shipping address provided. Please add your address in profile.',
      );
    }

    if (!profile.city && !profile.district) {
      throw new BadRequestException(
        'Your profile address is incomplete. Please update your shipping address.',
      );
    }

    const parts = [
      profile.city,
      profile.district,
      profile.state,
      profile.country,
      profile.zipcode,
    ].filter((part) => part && part.trim() !== '');

    return parts.join(', ');
  }

  //* ---------------------- HELPER: check valid status transaction ------------------
  private isValidTransition(current: OrderStatus, next: OrderStatus): boolean {
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.INITIATED]: [],
      [OrderStatus.PAID]: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      [OrderStatus.PENDING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return allowed[current]?.includes(next) ?? false;
  }

  //* ---------------------- USER: checkout ------------------
  async checkout(userId: string, dto: CreateOrderDto) {
    // step 1 - get cart
    const cart = await this.cartService.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    // step 2 - resolve shipping address
    const shippingAddress = await this.resolveShippingAddress(userId);

    // step 3 - calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // step 4 - create order
    const order = this.orderRepo.create({
      user: { id: userId } as any,
      totalAmount,
      shippingAddress,
      note: dto.note ?? null,
      status: OrderStatus.INITIATED,
    });
    await this.orderRepo.save(order);

    console.log(`Order created: ${order.id} for user: ${userId}`);

    // step 5 - save order items with price and name snapshot
    for (const cartItem of cart.items) {
      const orderItem = this.orderItemRepo.create({
        order,
        product: cartItem.product,
        productName: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
      });
      await this.orderItemRepo.save(orderItem);
    }

    // step 6 - initiate payment
    // --- eSewa
    if (dto.paymentMethod === PaymentMethod.ESEWA) {
      const esewaData = this.paymentProvider.initiateEsewaPayment(
        order.id,
        totalAmount,
      );

      const payment = this.paymentRepo.create({
        order,
        paymentMethod: PaymentMethod.ESEWA,
        status: PaymentStatus.INITIATED,
        amount: totalAmount,
      });
      await this.paymentRepo.save(payment);

      console.log(`eSewa payment initiated for order: ${order.id}`);

      return {
        orderId: order.id,
        paymentMethod: 'eSewa',
        esewaPayload: esewaData,
        shippingAddress,
        totalAmount,
      };
    }

    throw new BadRequestException('Invalid payment method.');
  }

  //* ---------------------- PAYMENT CALLBACKS ------------------
  async verifyEsewaPayment(encodedData: string) {
    console.log(' Verifying eSewa payment ...............');

    const result = await this.paymentProvider.verifyEsewaPayment(encodedData);

    console.log(`eSewa verification result:`, result);

    const order = await this.orderRepo.findOne({
      where: { id: result.orderId },
      relations: ['payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (result.status === 'COMPLETE') {
      order.payment.status = PaymentStatus.COMPLETED;
      order.payment.referenceId = result.ref_id;
      order.payment.transactionId = result.orderId;
      await this.paymentRepo.save(order.payment);

      order.status = OrderStatus.PAID;
      await this.orderRepo.save(order);

      console.log(`Order ${order.id} marked as PAID.`);

      return {
        success: true,
        message: 'Payment successful. Your order is confirmed.',
        orderId: order.id,
        status: OrderStatus.PAID,
      };
    }

    order.payment.status = PaymentStatus.FAILED;
    await this.paymentRepo.save(order.payment);

    throw new BadRequestException('eSewa payment was not successful.');
  }
}
