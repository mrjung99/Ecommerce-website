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
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';
import type { Response } from 'express';
import { RefreshAuthGuard } from './guard/refresh.auth.guard';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* --------------- CREATE USER ---------------
  @Public()
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createUser = await this.authService.createUser(createUserDto);

    if (createUser) {
      return { status: 'success', message: 'User created successfully!!' };
    }

    throw new BadRequestException({
      status: 'fail',
      message: 'Something went wrong!!',
    });
  }

  //* --------------- LOGIN ---------------
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user.id, res);

    return { status: 'success', message: 'Login successful!!', token };
  }

  //* --------------- REFRESH ROUTE ---------------
  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.id;
    const refreshToken = req.cookies.refreshToken;
    const token = await this.authService.refreshToken(
      userId,
      refreshToken,
      res,
    );

    return { status: 'success', token };
  }
}
