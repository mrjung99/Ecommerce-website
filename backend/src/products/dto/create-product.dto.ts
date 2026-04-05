import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProductImageDto } from './product-image.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  brand!: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  stock!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsArray()
  images!: ProductImageDto[]; // while uploading file from our server to the cloudinary we do not need this field
}
