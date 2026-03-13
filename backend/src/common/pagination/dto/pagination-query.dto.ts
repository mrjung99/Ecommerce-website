import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // when we read pagination query from the url it will read as string so we need to convert it to number, we did this for all in main.ts file
  limit?: number = 10;

  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
