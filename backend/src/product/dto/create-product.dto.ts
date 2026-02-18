import { IsDecimal, IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateProductDto {
   @IsString()
   @IsNotEmpty()
   name: string

   @IsString()
   @IsNotEmpty()
   description: string

   @IsDecimal()
   @IsNotEmpty()
   price: number

   @IsInt()
   @IsNotEmpty()
   stock: number

   @IsString()
   @IsNotEmpty()
   productImages: string[]

}
