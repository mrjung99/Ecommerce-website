import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //* ---------------- CHECKOUT --------------
  @Post('checkout')
  checkout(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.checkout(req.user.id, dto);
  }

  //* ------------- PAYMENT CALLBACKS ------------------
  @Public()
  @Get('esewa/verify')
  verifyEsewa(@Query('data') data: string) {
    return this.orderService.verifyEsewaPayment(data);
  }
}
