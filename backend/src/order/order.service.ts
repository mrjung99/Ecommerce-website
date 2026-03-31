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
import { OrderStatus } from 'src/common/enum/order-status.enum';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentMethod } from 'src/common/enum/payment-method.enum';
import { PaymentStatus } from 'src/common/enum/payment.status';
import { User } from 'src/users/entities/user.entity';
import { UpdateStatusDto } from './dto/update-status.dto';

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
      where: { user: { id: userId } },
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

  //* ------------------- HELPER: to show allowed transitions in error message ----------------
  private getAllowedTransitions(status: OrderStatus): OrderStatus[] {
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.INITIATED]: [],
      [OrderStatus.PAID]: [OrderStatus.PENDING, OrderStatus.CANCELLED],
      [OrderStatus.PENDING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    return allowed[status] ?? [];
  }

  //* ---------------------- USER: checkout ------------------
  async checkout(userId: string, dto: CreateOrderDto, user: User) {
    // step 1 - get cart
    const cart = await this.cartService.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    // step 2 - check for unpaid existing order
    const existingOrder = await this.orderRepo.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.INITIATED,
      },
      relations: ['payment', 'items'],
    });

    if (existingOrder) {
      if (existingOrder?.payment.paymentMethod === PaymentMethod.ESEWA) {
        const eSewaData = this.paymentProvider.initiateEsewaPayment(
          existingOrder.id,
          existingOrder.totalAmount,
        );

        return {
          orderId: existingOrder.id,
          paymentMethod: 'esewa',
          esewaPayload: eSewaData,
          shippingAddress: existingOrder.shippingAddress,
          totalAmount: existingOrder.totalAmount,
          message: 'Resuming existing unpaid order',
        };
      }
    }

    // step 3 - resolve shipping address
    const shippingAddress = await this.resolveShippingAddress(userId);

    // step 4 - calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // step 5 - create order
    const order = this.orderRepo.create({
      user: { id: userId } as any,
      totalAmount,
      shippingAddress,
      note: dto.note ?? null,
      status: OrderStatus.INITIATED,
    });
    await this.orderRepo.save(order);

    console.log(`Order created: ${order.id} for user: ${userId}`);

    // step 6 - save order items
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

    // step 7 - initiate payment
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

      await this.cartService.clearCart(userId);

      console.log(`eSewa payment initiated for order: ${order.id}`);

      return {
        orderId: order.id,
        paymentMethod: 'eSewa',
        esewaPayload: esewaData,
        shippingAddress,
        totalAmount,
        // frontend: build a hidden form with esewaPayload fields
        // and submit it to esewaPayload.payment_url
      };
    }

    if (dto.paymentMethod === PaymentMethod.KHALTI) {
      const khaltiData = await this.paymentProvider.initiateKhaltiPayment(
        order.id,
        totalAmount,
        user.profile.firstName ?? 'customer',
        user.email,
      );

      const payment = this.paymentRepo.create({
        order,
        paymentMethod: PaymentMethod.KHALTI,
        status: PaymentStatus.INITIATED,
        amount: totalAmount,
        pidx: khaltiData.pidx,
      });
      await this.paymentRepo.save(payment);

      await this.cartService.clearCart(userId);

      console.log(`Khalti payment initiated. pidx: ${khaltiData.pidx}`);

      return {
        orderId: order.id,
        paymentMethod: PaymentMethod.KHALTI,
        paymentUrl: khaltiData.payment_url,
        shippingAddress,
        totalAmount,
        // frontend: redirect user to paymentUrl
      };
    }

    throw new BadRequestException('Invalid payment method.');
  }

  //* ---------------------- PAYMENT CALLBACKS ------------------
  async verifyEsewaPayment(encodedData: string) {
    console.log(' Verifying eSewa payment ...............');
    if (!encodedData) {
      throw new BadRequestException('Missing payment data from esewa.');
    }

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

  //* -------------------------- verify khalti payment -----------------------
  async verifyKhaltiPayment(pidx: string) {
    console.log(`Verifying khalti payment, pidx: ${pidx}`);

    const payment = await this.paymentRepo.findOne({
      where: { pidx },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found.');
    }

    const result = await this.paymentProvider.verifyKhaltiPayment(pidx);

    console.log('Khalti verification result: ', result);

    if (result.status === 'Completed') {
      payment.status = PaymentStatus.COMPLETED;
      payment.transactionId = result.transaction_id;
      await this.paymentRepo.save(payment);

      payment.order.status = OrderStatus.PAID;
      await this.orderRepo.save(payment.order);

      console.log(`Order ${payment.order.id} marked as paid`);

      return {
        success: true,
        message: 'Payment successful. Your order is confirmed.',
        orderId: payment.order.id,
        status: OrderStatus.PAID,
      };
    }

    payment.status = PaymentStatus.FAILED;
    await this.paymentRepo.save(payment);

    throw new BadRequestException('Khalti payment was not successful.');
  }

  //* -------------- USER: get my orders ----------------------
  async getMyOrders(userId: string) {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['payment', 'items'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      note: order.note,
      paymentMethod: order.payment.paymentMethod,
      paymentStatus: order.payment.status,
      transactionId: order.payment.transactionId,
      items: order.items.map((item) => ({
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  //* --------------------------USER: get single order ---------------------
  async getMyOrder(userId: string, orderid: string) {
    const order = await this.orderRepo.find({
      where: {
        id: orderid,
        user: { id: userId },
      },
      relations: ['items', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      note: order.note,
      paymentMethod: order.payment.paymentMethod,
      paymentStatus: order.payment.status,
      transactionId: order.payment.transactionId,
      items: order.items.map((item) => ({
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  //* --------------------------USER: cancel order ---------------------
  async cancelMyOrder(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, user: { id: userId } },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException(
        'Order can only be cancelled before admin starts processing it.',
      );
    }

    order.status = OrderStatus.CANCELLED;
    return await this.orderRepo.save(order);
  }

  //* --------------------------USER: confirm order ---------------------
  async confirmReceived(userId: string, orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, user: { id: userId } },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'You and only confirm after the order is marked as delivered.',
      );
    }

    order.status = OrderStatus.COMPLETED;
    return await this.orderRepo.save(order);
  }

  //* ------------------------------- ADMIN: get all orders -------------------
  async getAllOrders(status?: OrderStatus, paymentMethod?: PaymentMethod) {
    const orders = await this.orderRepo.find({
      relations: ['user', 'items', 'payment'],
    });

    let result = orders;
    if (status) {
      result = result.filter((o) => o.status === status);
    }

    if (paymentMethod) {
      result = result.filter((o) => o.payment.paymentMethod === paymentMethod);
    }

    return result;
  }

  //* ------------------------ ADMIN: update order status ----------------------------
  async updateOrderStatus(orderId: string, dto: UpdateStatusDto) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    if (!this.isValidTransition(order.status, dto.status)) {
      throw new BadRequestException(
        `Can not move order from '${order.status}' to '${dto.status}'` +
          `Valid transitions from '${order.status}':` +
          `${this.getAllowedTransitions(order.status).join(', ') || 'none'}`,
      );
    }

    const previousStatus = order.status;
    order.status = dto.status;
    await this.orderRepo.save(order);

    return {
      orderid: order.id,
      previousStatus,
      newStatus: order.status,
      updatedAt: order.updatedAt,
    };
  }

  //* ----------------------- ADMIN: get payment report ------------------------
  async getPaymentReport() {
    const payments = await this.paymentRepo.find({
      where: { status: PaymentStatus.COMPLETED },
      relations: ['order'],
    });

    let totalRevenue = 0;
    let khaltiTotal = 0;
    let esewaTotal = 0;

    for (const payment of payments) {
      totalRevenue += Number(payment.amount);

      if (payment.paymentMethod === PaymentMethod.ESEWA) {
        esewaTotal += Number(payment.amount);
      }

      if (payment.paymentMethod === PaymentMethod.KHALTI) {
        khaltiTotal += Number(payment.amount);
      }
    }

    return {
      totalOrders: payments.length,
      totalRevenue,
      esewaTotal,
      khaltiTotal,
      breakdown: payments.map((p) => ({
        orderId: p.order.id,
        method: p.paymentMethod,
        amount: p.amount,
        transactionId: p.transactionId,
        date: p.createdAt,
      })),
    };
  }
}
