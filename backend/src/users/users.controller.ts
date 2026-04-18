import {
  Controller,
  Req,
  NotFoundException,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { Public } from '../auth/decorator/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //* --------------- CREATE USERS ----------------
  @Public()
  @Post('signup')
  async createUser(@Body() dto: CreateUserDto) {
    await this.usersService.createUser(dto);
    return {
      success: true,
      message: 'User created successfully.',
    };
  }

  //* ----------------- GET USER AND PROFILE ---------------
  @Get()
  async getUserAndProfile(@Req() req: any) {
    const userId = req.user.id;
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found!!');
    }

    return {
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  //* ---------------------- VERIFY USER -----------------
  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyUser(@Body() dto: VerifyUserDto) {
    const message = await this.usersService.verifyUser(dto);
    return {
      success: true,
      message,
    };
  }

  //* --------------- RESEND OTP ---------------
  @Public()
  @Post('resendOtp')
  async resendOtp(@Body('email') email: string) {
    await this.usersService.resendOtp(email);

    return {
      success: true,
      message: 'If email exist OTP code is sent to your account.',
    };
  }
}
