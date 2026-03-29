import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/common/enum/order-status.enum';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
