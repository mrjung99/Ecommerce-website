import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";
import { Profile } from "src/profile/entities/profile.entity";


export class CreateUserDto {

   @IsEmail()
   @IsNotEmpty()
   email: string

   @IsString()
   @IsNotEmpty()
   @Length(6, 100)
   password: string

   @IsOptional()
   profile: Profile
}
