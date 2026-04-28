import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'Mr9332',
    description: 'username or email',
  })
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty({
    example: 'test1234A',
    description: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
