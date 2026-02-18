import { CartItem } from "src/cart-item/entities/cart-item.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
   @PrimaryGeneratedColumn('uuid')
   id: string

   @OneToOne(() => User, user => user.cart)
   @JoinColumn()
   user: User

   @OneToMany(() => CartItem, cartItem => cartItem.cart)
   cartItem: CartItem
}
