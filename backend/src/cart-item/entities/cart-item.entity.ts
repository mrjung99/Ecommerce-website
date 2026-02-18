import { Injectable } from "@nestjs/common";
import { Cart } from "src/cart/entities/cart.entity";
import { Product } from "src/product/entities/product.entity";
import { ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Injectable()
export class CartItem {
   @PrimaryGeneratedColumn('uuid')
   id: string

   @ManyToOne(() => Cart, cart => cart.cartItem)
   cart: Cart

   // @ManyToOne(() => Product, product => product.cartItem)
   // product: Product
}