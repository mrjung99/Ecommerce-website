import { IsOptional, IsString } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  parentId?: string;
}
