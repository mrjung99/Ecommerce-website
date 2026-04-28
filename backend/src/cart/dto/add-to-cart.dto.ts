import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: '91944c50-eac4-4404-a1b4-2a7d9416b0d6',
    description: 'Product id',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    example: 3,
    description: 'quantity',
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}
