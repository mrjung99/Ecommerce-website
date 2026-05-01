import { OrderStatus } from '../../common/enum/order-status.enum';
import { Payment } from '../../payment/entities/payment.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.INITIATED,
  })
  status!: OrderStatus;

  @Column()
  totalAmount!: number;

  @Column({ type: 'varchar' })
  phone!: string;

  @Column({
    type: 'text',
  })
  shippingAddress!: string;

  @Column({ type: 'text', nullable: true })
  note?: string | null;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
  payment!: Payment;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
