import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;
}
