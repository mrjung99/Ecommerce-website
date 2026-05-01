import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: '2026/04/04',
    description: 'date of birth',
  })
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({
    example: 'male',
    description: 'gender',
  })
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

  @ApiProperty({
    example: 'kathmandu',
    description: 'district',
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    example: 'kathmandu',
    description: 'city',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: '9879',
    description: 'zipcode',
  })
  @IsString()
  @IsOptional()
  zipcode?: string;
}
