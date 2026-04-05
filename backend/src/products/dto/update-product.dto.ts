import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ProductImageDto } from './product-image.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
   @IsOptional()
   @IsArray()
   @ValidateNested({each:true})
   @Type(()=>ProductImageDto)
   images?: ProductImageDto[] ;
}
