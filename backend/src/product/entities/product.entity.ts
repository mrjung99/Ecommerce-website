import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductImage } from "src/product-image/entities/product-image.entity";
import { CartItem } from "src/cart-item/entities/cart-item.entity";


@Entity()
export class Product {
   @PrimaryGeneratedColumn('uuid')
   id: string


   @Column({
      type: 'varchar',
      nullable: false
   })
   name: string


   @Column({
      type: 'text',
      nullable: false
   })
   description: string


   @Column({
      type: 'varchar',
      nullable: true
   })
   brand: string


   @Column({
      type: 'decimal',
      nullable: false,
      precision: 10,
      scale: 2,
      //! typeOrm save decimal as a string so we have to convert it as number while saving to db(to) and reading from the db (from)
      transformer: {
         to: (value: number) => value, // save as a number
         from: (value: string) => parseFloat(value) // read as a float
      }
   })
   price: number


   @Column({
      type: 'integer',
      nullable: false
   })
   stock: number


   @Column({
      type: 'array',
      nullable: true
   })
   productImages: string[]

   // @OneToMany(() => ProductImage, productImage => productImage.product, { cascade: true })
   // productImages: ProductImage[]


   // @OneToMany(() => CartItem, cartItem => cartItem.product)
   // cartItem: CartItem


   @CreateDateColumn()
   createdAt: Date


   @UpdateDateColumn()
   updatedAt: Date

}
