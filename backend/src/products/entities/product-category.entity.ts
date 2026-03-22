import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  slug: string;

  @ManyToMany(() => ProductCategory, (c) => c.children, { nullable: true })
  parent: ProductCategory;

  @OneToMany(() => ProductCategory, (c) => c.parent)
  children: ProductCategory;

  @OneToMany(() => Product, (p) => p.category)
  products: Product[];
}
