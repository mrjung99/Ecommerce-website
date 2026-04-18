import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';
import type { Response } from 'express';
import { RefreshAuthGuard } from './guard/refresh.auth.guard';
import { Public } from './decorator/public.decorator';
import { Throttle } from '@nestjs/throttler';
import type { RefreshRequest } from './interface/refresh-request.interface';
import type { LoginRequest } from './interface/login-request.interface';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* --------------- CREATE USER ---------------
  @Public()
  @Throttle({ short: { ttl: 3600000, limit: 3 } })
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createUser = await this.authService.createUser(createUserDto);

    if (createUser) {
      return { success: true, message: 'User created successfully!!' };
    }

    throw new BadRequestException({
      status: 'fail',
      message: 'Something went wrong!!',
    });
  }

  //* --------------- LOGIN ---------------
  @Public()
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: any,
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(req, dto, res);
    return { status: 'success', message: 'Login successful!!', token };
  }

  //* --------------- REFRESH ROUTE ---------------
  @Public()
  @Throttle({ short: { ttl: 60000, limit: 20 } })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.id;
    const sessionId = req.user.sessionId;
    const refreshToken = req.user.refreshToken;

    const token = await this.authService.refreshToken(
      userId,
      sessionId,
      refreshToken,
      res,
    );

    return { success: true, token };
  }

  // //* -------------------- FORGOT PASSWORD ------------------
  @Post()
  async forgotPassword(@Body('email') email: string) {
    const passwordResetToken = await this.authService.forgotPassword(email);

    return {
      success: true,
      passwordResetToken,
    };
  }
}
