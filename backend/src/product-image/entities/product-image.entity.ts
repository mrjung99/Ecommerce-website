import { Product } from "src/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ProductImage {
   @PrimaryGeneratedColumn('uuid')
   id: string

   @Column({
      type: 'text'
   })
   url: string


   // @ManyToOne(() => Product, product => product.productImages, { onDelete: 'CASCADE' })
   // product: Product
}