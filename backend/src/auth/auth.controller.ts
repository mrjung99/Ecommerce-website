import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { RefreshAuthGuard } from './guard/refresh.auth.guard';

@Controller('auth')
export class AuthController {
   constructor(
      private readonly authService: AuthService
   ) { }


   //* -------------------CREATE ACCOUNT -----------------
   @Public()
   @Post('signup')
   async signup(@Body() createUserDto: CreateUserDto) {
      const user = await this.authService.createAccount(createUserDto);

      if (user) {
         return {
            status: 'success',
            message: 'Account created successfully!!'
         }
      };

      return user;
   }


   //* --------------- LOGIN ---------------------
   @Public()
   @UseGuards(LocalAuthGuard)
   @Post('login')
   @HttpCode(HttpStatus.OK)
   async login(@Request() req: any) {
      const token = await this.authService.login(req.user.id)

      return {
         status: 'success',
         message: "Login successful!!",
         token
      }
   }


   //* -------------- REFRESH TOKEN -------------------
   @Public()
   @UseGuards(RefreshAuthGuard)
   @Post('refresh')
   async refreshToken(@Request() req: any) {
      return await this.authService.getRefreshToken(req.user.id)
   }
}
