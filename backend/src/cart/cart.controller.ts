import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //* ------------------- GET USER CART ---------------
  @Get()
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get cart (user)' })
  @ApiOkResponse({ description: ' cart item fetched successfully.' })
  @ApiBadRequestResponse({ description: 'Quantity is invalid.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getCart(@Request() req) {
    const cart = await this.cartService.getOrCreateCart(req.user.id);

    if (cart.items.length <= 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    return {
      success: true,
      cart,
    };
  }

  //* ------------------- GET CART TOTAL ---------------
  @Get('total')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get cart total (user)' })
  @ApiOkResponse({ description: 'success.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getTotal(@Request() req) {
    return await this.cartService.getCartTotal(req.user.id);
  }

  //* ------------------- ADD ITEM TO CART ---------------
  @Post()
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Add to cart.' })
  @ApiOkResponse({ description: 'Added to cart successfully.' })
  @ApiBadRequestResponse({ description: 'Quantity is invalid.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async addItem(@Request() req, @Body() dto: AddToCartDto) {
    return await this.cartService.addItem(req.user.id, dto);
  }

  //* ------------------- UPDATE ITEM TO CART(QUANTITY) ---------------
  @Patch(':itemId') // here item id means product id
  @ApiBearerAuth('accessToken')
  @ApiParam({ name: 'itemId', example: '91944c50-eac4-4404-a1b4-2a7d9416b0d6' })
  @ApiOperation({
    summary: 'Update cart product quantity (user)',
    description:
      'Will update the quantity of a product in cart, here we are passing product it as cart item param',
  })
  @ApiOkResponse({ description: 'success.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return await this.cartService.updateCartItem(req.user.id, itemId, dto);
  }

  //* ------------------- DELETE ITEM FROM CART ---------------
  @Delete(':itemId')
  @ApiBearerAuth('accessToken')
  @ApiParam({ name: 'itemId', example: '91944c50-eac4-4404-a1b4-2a7d9416b0d6' })
  @ApiOperation({
    summary: 'Delete cart item (user)',
    description:
      'This will delete the cart item, here we are passing product it as cart item param',
  })
  @ApiOkResponse({ description: 'success.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: 'Clear cart (user)',
    description: 'This will delete all the cart item.',
  })
  @ApiOkResponse({ description: 'success.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async clearCart(@Request() req) {
    const message = await this.cartService.clearCart(req.user.id);
    return {
      status: 'success',
      message,
    };
  }
}
