import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guard/loacl.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* --------------- CREATE USER ---------------
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createUser = await this.authService.createUser(createUserDto);

    if (createUser) {
      return { status: 'success', message: 'User created successfully!!' };
    }

    return new BadRequestException({
      status: 'fail',
      message: 'Something went wrong!!',
    });
  }

  //* --------------- LOGIN ---------------
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: any) {
    const token = await this.authService.login(req.user.id);

    return { status: 'success', message: 'Login successful!!', token };
  }
}
