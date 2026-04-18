import { IsDate, IsString } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  hashedOtp!: string;

  @IsDate()
  expiresAt!: Date;
}
