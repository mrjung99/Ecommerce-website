import { IsString } from "class-validator";

export class ProductImageDto{
   @IsString()
   publicId!:string

   @IsString()
   originalUrl!:string

   @IsString()
   thumbnail!:string

   @IsString()
   medium!:string

  @IsString()
   large!:string
}