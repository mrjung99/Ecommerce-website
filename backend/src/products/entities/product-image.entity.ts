import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  publicId!: string;

  @Column()
  originalUrl!: string;

  @Column()
  thumbnail!: string;

  @Column()
  medium!: string;

  @Column()
  large!: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product!: Product;
}
