import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Profile } from '../../profile/entities/profile.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one uppercase letter and number.',
  })
  password!: string;

  @IsOptional()
  profile?: Profile;
}
