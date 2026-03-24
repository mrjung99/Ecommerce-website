import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }
}
