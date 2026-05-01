import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../common/enum/payment-method.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: PaymentMethod.KHALTI,
    enum: PaymentMethod,
    description: 'Payment gateway',
  })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Deliver fast😁',
  })
  @IsOptional()
  @IsString()
  note?: string | null;
}
