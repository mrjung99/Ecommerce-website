import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    unique: true,
  })
  name!: string;

  @Column({
    unique: true,
  })
  slug!: string;

  @ManyToOne(() => ProductCategory, (c) => c.children, { nullable: true })
  parent!: ProductCategory | null;

  @OneToMany(() => ProductCategory, (c) => c.parent)
  children!: ProductCategory[];

  @OneToMany(() => Product, (p) => p.category)
  products!: Product[];
}
