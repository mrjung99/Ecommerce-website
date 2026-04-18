import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail({}, { each: true })
  recipients!: string[];

  @IsString()
  subject!: string;

  @IsString()
  html!: string;

  @IsOptional()
  @IsString()
  text?: string;
}
