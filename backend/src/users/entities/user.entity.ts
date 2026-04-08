import { Role } from '../../auth/enum/role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import { Profile } from '../../profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PasswordReset } from './password-reset.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @Column({
    type: 'text',
    nullable: true,
  })
  hashedRefreshToken?: string;

  @OneToMany(() => PasswordReset, (reset) => reset.user)
  passwordRestTokens!: PasswordReset[];

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
