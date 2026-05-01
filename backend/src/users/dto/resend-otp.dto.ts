import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
