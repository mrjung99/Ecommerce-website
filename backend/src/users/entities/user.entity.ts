import { Role } from '../../auth/enum/role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import { Profile } from '../../profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from '../enum/userStatus.enum';
import { Otp } from '../../otp/entity/otp.entity';
import { Session } from '../../session/entities/session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  userName!: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'user_role',
    default: Role.USER,
  })
  role!: Role;

  @Column({ type: 'enum', enum: Status, default: Status.UNVERIFIED })
  userStatus!: Status;

  @OneToMany(() => Otp, (otp) => otp.user)
  otp!: Otp[];

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  profile!: Profile;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart!: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}
