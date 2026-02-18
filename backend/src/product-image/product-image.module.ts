import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';

@Module({
  providers: [ProductImageService]
})
export class ProductImageModule {}
