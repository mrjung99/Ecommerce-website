import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { Repository } from 'typeorm';
import { Otp } from './entity/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { VerifyUserDto } from '../users/dto/verify-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) {}

  //* ---------------- SAVE OTP ------------------
  async saveOtpInfo(user: User, hashedOtp: string, expiresAt: Date) {
    const otp = this.otpRepo.create({ user, hashedOtp, expiresAt });
    try {
      return await this.otpRepo.save(otp);
    } catch (error) {
      console.log(error);
    }
  }

  //* ----------- VERIFY OTP ---------------
  async verifyOtp(userId: string, otp: string) {
    const userOtp = await this.otpRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!userOtp || !userOtp.hashedOtp) throw new UnauthorizedException();

    return await argon2.verify(userOtp.hashedOtp, otp);
  }

  //* ------------ GET OTP INFO -------------
  async getOtpInfo(userId: string) {
    return await this.otpRepo.findOne({
      where: { user: { id: userId } },
    });
  }

  //* ------------ DELETE OTP ----------
  async deleteOtp(userId: string) {
    return await this.otpRepo.delete({
      user: { id: userId },
    });
  }
}
