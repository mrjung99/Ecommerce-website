import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({
    example: '9879792792',
    description: 'contact info.',
  })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiProperty({
    example: 'nepal',
    description: 'country',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    example: '7',
    description: 'state',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  zipcode?: string;
}
