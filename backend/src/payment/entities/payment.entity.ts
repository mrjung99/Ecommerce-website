import { PaymentMethod } from 'src/common/enum/payment-method.enum';
import { PaymentStatus } from 'src/common/enum/payment.status';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.INITIATED,
  })
  status: PaymentStatus;

  @Column()
  amount: number;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  pidx: string;

  @Column({ nullable: true })
  referenceId: string;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn()
  createdAt: Date;
}
