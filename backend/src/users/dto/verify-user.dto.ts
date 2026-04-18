import { IsEmail, IsOptional, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsString()
  otp!: string;

  @IsEmail()
  @IsOptional()
  email!: string;
}
