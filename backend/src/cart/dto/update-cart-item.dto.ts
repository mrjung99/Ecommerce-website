import { PartialType } from '@nestjs/mapped-types';
import { AddToCartDto } from './add-to-cart.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
