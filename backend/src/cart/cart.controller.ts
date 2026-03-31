import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //* ------------------- GET USER CART ---------------
  @Get()
  getCart(@Request() req) {
    return this.cartService.getOrCreateCart(req.user.id);
  }

  //* ------------------- GET CART TOTAL ---------------
  @Get('total')
  async getTotal(@Request() req) {
    return await this.cartService.getCartTotal(req.user.id);
  }

  //* ------------------- ADD ITEM TO CART ---------------
  @Post()
  async addItem(@Request() req, @Body() dto: AddToCartDto) {
    return await this.cartService.addItem(req.user.id, dto);
  }

  //* ------------------- UPDATE ITEM TO CART(QUANTITY) ---------------
  @Patch(':itemId')
  async updateItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return await this.cartService.updateCartItem(req.user.id, itemId, dto);
  }

  //* ------------------- DELETE ITEM FROM CART ---------------
  @Delete(':itemId')
  async deleteItem(@Request() req, @Param('itemId') itemId: string) {
    const item = await this.cartService.removeItem(req.user.id, itemId);
    return {
      status: 'success',
      message: 'Item deleted successfully!!',
      item,
    };
  }

  //* ------------------- DELETE all ITEM FROM CART ---------------
  @Delete()
  async clearCart(@Request() req) {
    const message = await this.cartService.clearCart(req.user.id);
    return {
      status: 'success',
      message,
    };
  }
}
