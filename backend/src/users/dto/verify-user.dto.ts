import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({
    example: '989898',
    description: 'OTP code, 6 digit',
  })
  @IsString()
  otp!: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'email',
  })
  @IsEmail()
  @IsOptional()
  email!: string;
}
