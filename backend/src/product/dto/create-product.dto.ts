import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
   @IsString()
   @IsNotEmpty()
   name: string

   @IsString()
   @IsNotEmpty()
   description: string

   @IsNumber({ maxDecimalPlaces: 2 })
   @IsNotEmpty()
   price: number

   @IsInt()
   @IsNotEmpty()
   stock: number

   @IsArray()
   @ArrayNotEmpty()
   @IsString({ each: true })
   productImages: string[]
}
