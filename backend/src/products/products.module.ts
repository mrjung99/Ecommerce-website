import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ImageUploadModule } from 'src/image-upload/image-upload.module';
import { ProductImage } from './entities/product-image.entity';
import { ProductCategory } from './entities/product-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, ProductCategory]),
    PaginationModule,
    ImageUploadModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
