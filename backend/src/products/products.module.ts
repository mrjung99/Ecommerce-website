import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PaginationModule } from '../common/pagination/pagination.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';
import { ProductImage } from './entities/product-image.entity';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ProductCategory } from '../product-category/entities/product-category.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    forwardRef(() => ProductCategoryModule),
    TypeOrmModule.forFeature([Product, ProductImage, ProductCategory]),
    PaginationModule,
    ImageUploadModule,
    CloudinaryModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
