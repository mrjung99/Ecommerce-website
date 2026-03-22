import { Type } from 'class-transformer';
import { IsOptional, IsString, isString } from 'class-validator';

export class FilterProductDto {
  @IsString()
  @IsOptional()
  categorySlug?: string;

  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}
