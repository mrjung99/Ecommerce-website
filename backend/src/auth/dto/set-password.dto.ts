import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  password!: string;
}
