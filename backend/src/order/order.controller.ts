import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { OrderStatus } from 'src/common/enum/order-status.enum';
import { PaymentMethod } from 'src/common/enum/payment-method.enum';
import RolesGuard from 'src/auth/guard/roles.guard';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //* ---------------- CHECKOUT --------------
  @Post('checkout')
  checkout(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.checkout(req.user.id, dto, req.user);
  }

  //* ------------- PAYMENT CALLBACKS ------------------
  @Public()
  @Get('esewa/verify')
  verifyEsewa(@Query('data') data: string) {
    return this.orderService.verifyEsewaPayment(data);
  }

  @Public()
  @Get('esewa/failure')
  esewaFailure() {
    return {
      success: false,
      message: 'Payment failed or was cancelled by user',
    };
  }

  @Public()
  @Get('khalti/verify')
  verifyKhalti(@Query('pidx') pidx: string) {
    return this.orderService.verifyKhaltiPayment(pidx);
  }

  //! ================================ USER ROUTES ===========================================
  //* ---------------- USER: get orders --------------
  @Get('my')
  async getMyOrders(@Request() req) {
    const orders = await this.orderService.getMyOrders(req.user.id);

    return {
      success: true,
      orders,
    };
  }

  //* ---------------- USER: get single order --------------
  @Get('my/:orderId')
  async getMyOrder(@Request() req, @Param('orderId') orderId: string) {
    const order = await this.orderService.getMyOrder(req.user.id, orderId);

    return {
      success: true,
      order,
    };
  }

  //* ---------------- USER: cancel order --------------
  @Patch('my/:orderId/cancel')
  async cancelMyOrder(@Request() req, @Param('orderId') orderId: string) {
    const orderToCancel = await this.orderService.cancelMyOrder(
      req.user.id,
      orderId,
    );

    return {
      success: true,
      message: `Your order: ${orderId}, has been cancelled successfully.`,
    };
  }

  //* ---------------- USER: conform order --------------
  @Patch('my/:orderId/confirm')
  async conformOrderReceived(
    @Request() req,
    @Param('orderId') orderId: string,
  ) {
    await this.orderService.confirmReceived(req.user.id, orderId);
    return {
      success: true,
      message: `Your order: ${orderId}, marked as successfully received.`,
    };
  }

  //! ================================ ADMIN ROUTES ===========================================

  //* --------------------- ADMIN: get all orders ------------------------------
  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/all')
  async getAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('paymentMethod') paymentMethod?: PaymentMethod,
  ) {
    const orders = await this.orderService.getAllOrders(status, paymentMethod);
  }

  //* --------------------- ADMIN: update order status ------------------------------
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Patch('admin/:orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateStatusDto,
  ) {
    const orderToUpdate = await this.orderService.updateOrderStatus(
      orderId,
      dto,
    );

    return {
      success: true,
      message: 'Order status is updated successfully.',
      order: orderToUpdate,
    };
  }

  //* --------------------- ADMIN: get payment report ------------------------------
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Get('admin/reports')
  async getReports() {
    const report = await this.orderService.getPaymentReport();

    return {
      success: true,
      report,
    };
  }
}
