import { PartialType } from '@nestjs/mapped-types';
import { AddToCartDto } from './add-to-cart.dto';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 2,
    description: 'Update product quantity.',
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}
