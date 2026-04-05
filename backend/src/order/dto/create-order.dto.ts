import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../common/enum/payment-method.enum';

export class CreateOrderDto {
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  note?: string | null;
}
