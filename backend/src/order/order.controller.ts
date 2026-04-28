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
import { Public } from '../auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { OrderStatus } from '../common/enum/order-status.enum';
import { PaymentMethod } from '../common/enum/payment-method.enum';
import RolesGuard from '../auth/guard/roles.guard';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //* ---------------- CHECKOUT --------------
  @Post('checkout')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Checkout.' })
  @ApiResponse({ status: 200, description: 'Payment successful.' })
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
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get orders (User)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getMyOrders(@Request() req) {
    const orders = await this.orderService.getMyOrders(req.user.id);

    return {
      success: true,
      orders,
    };
  }

  //* ---------------- USER: get single order --------------
  @Get('my/:orderId')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Fetch Order by id (user)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getMyOrder(@Request() req, @Param('orderId') orderId: string) {
    const order = await this.orderService.getMyOrder(req.user.id, orderId);

    return {
      success: true,
      order,
    };
  }

  //* ---------------- USER: cancel order --------------
  @Patch('my/:orderId/cancel')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Cancel order (User)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Conform order (user)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Fetch all Orders (admin)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('paymentMethod') paymentMethod?: PaymentMethod,
  ) {
    const orders = await this.orderService.getAllOrders(status, paymentMethod);
    return {
      success: true,
      orders,
    };
  }

  //* --------------------- ADMIN: update order status ------------------------------
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Patch('admin/:orderId/status')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Update order status (admin)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get Payment report (admin)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getReports() {
    const report = await this.orderService.getPaymentReport();

    return {
      success: true,
      report,
    };
  }
}
