import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Profile } from '../profile/entities/profile.entity';
import { MailService } from '../mail/mail.service';
import { SendMailDto } from '../mail/dto/sendMail.dto';
import crypto from 'crypto';
import { OtpService } from '../otp/otp.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { Status } from './enum/userStatus.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  //* ------------------CREATE USER --------------
  async createUser(createUserDto: CreateUserDto) {
    try {
      // check user already exist or not
      const userExist = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (userExist) {
        throw new ConflictException('User already exist with that email.');
      }

      const profile = this.profileRepo.create(createUserDto.profile || {});

      const hashedPassword = await argon2.hash(createUserDto.password);

      const user = this.userRepo.create({
        ...createUserDto,
        password: hashedPassword,
        profile,
      });

      const { expiresAt, otp } = this.generateOtp();
      const hashedOtp = await argon2.hash(otp);

      await this.sendMailVerification(
        createUserDto.email,
        createUserDto.userName,
        otp,
      );

      const savedUser = await this.userRepo.save(user);
      console.log(savedUser);

      await this.otpService.saveOtpInfo(user, hashedOtp, expiresAt);
      return savedUser;
    } catch (error: any) {
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new BadRequestException({
            status: 'fail',
            field: 'email',
            message: 'User with this email already exist!!',
          });
        }
      }
    }
  }

  //* --------------- VERIFY USER ACCOUNT --------------
  async verifyUser(dto: VerifyUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException("User doesn't exist with this email.");
    }

    const isValidOtp = await this.otpService.verifyOtp(user.id, dto.otp);
    if (!isValidOtp) throw new UnauthorizedException();

    user.userStatus = Status.VERIFIED;
    await this.userRepo.save(user);
    await this.otpService.deleteOtp(user.id);
    return 'Your account is verified, please proceed to login.';
  }

  //* -------------- SEND VERIFICATION MAIL -------------
  async sendMailVerification(to: string, userName: string, otp: string) {
    const dto: SendMailDto = {
      recipients: [to],
      subject: 'Please verify your account.',
      html: this.mailHtml(userName, otp),
    };

    await this.mailService.sendMail(dto);
  }

  //* -------------- MAIL HTML ----------------
  mailHtml(userName: string, otp: string) {
    return `
    <h4>Hello, ${userName} </h4>
    <p>Your OTP code is: </p> <h1>${otp}</h1>
    <p>This otp code will expires after 10 minutes.</>
    `;
  }

  //* -------------- GENERATE OTP ------------
  generateOtp() {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const otp = crypto.randomInt(100000, 1000000).toString();
    return { expiresAt, otp };
  }

  //* --------------- RESEND OTP ------------
  async resendOtp(email: string) {
    const user = await this.userRepo.findOne({
      where: { email: email },
    });
    console.log(user);

    if (!user) {
      throw new BadRequestException(
        "You don't have account with this email, please register first.",
      );
    }

    // delete old otp
    this.otpService.deleteOtp(user.id);

    const { expiresAt, otp } = this.generateOtp();
    const hashedOtp = await argon2.hash(otp);
    this.sendMailVerification(email, user.userName, otp);
    this.otpService.saveOtpInfo(user, hashedOtp, expiresAt);

    return 'If email exist OTP code is sent to your account.';
  }

  //* ------------------ FIND USER BY EMAIL--------------
  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
    });
  }

  //* ------------------ FIND USER BY ID --------------
  async findUserById(userId: string) {
    return await this.userRepo.findOneBy({ id: userId });
  }

  //* ---------------- FIND USER BY USERNAME OR EMAIL -----------------
  async findUserForLogin(login: string) {
    return await this.userRepo.findOne({
      where: [{ email: login }, { userName: login }],
    });
  }

  //* ------------------ VALIDATE JWT USER --------------
  async validateJwtUser(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  //* ---------------- UPDATE RESET PASSWORD -----------------
  async updateResetPass(userId: string, password: string) {
    return await this.userRepo.update({ id: userId }, { password });
  }

  //* ------------------ SAVE USER --------------
  async saveProfile(user: User) {
    return await this.userRepo.save(user);
  }
}
