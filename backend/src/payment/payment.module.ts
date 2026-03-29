import { Module } from '@nestjs/common';
import { PaymentProvider } from './payment.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentProvider],
  exports: [PaymentProvider],
})
export class PaymentModule {}
