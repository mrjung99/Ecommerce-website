import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemService {
  create(createCartItemDto: CreateCartItemDto) {
    return 'This action adds a new cartItem';
  }
}
