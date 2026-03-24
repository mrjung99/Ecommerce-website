import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
  })
  brand: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  stock: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @ManyToOne(() => ProductCategory, (c) => c.products)
  category: ProductCategory;

  @OneToMany(() => ProductImage, (img) => img.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImage[];
}
