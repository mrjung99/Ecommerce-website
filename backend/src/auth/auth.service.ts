import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import authConfig from './config/authConfig';
import { UserService } from 'src/user/user.service';
import argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refreshConfig';
import { ref } from 'process';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
   constructor(
      @Inject(authConfig.KEY)
      private readonly authConfiguration: ConfigType<typeof authConfig>,
      @Inject(refreshConfig.KEY)
      private readonly refreshConfiguration: ConfigType<typeof refreshConfig>,
      private readonly userService: UserService,
      private readonly jwtService: JwtService
   ) { }


   //* -------------------CREATE ACCOUNT ---------------
   async createAccount(createUserDto: CreateUserDto) {
      return await this.userService.signUP(createUserDto);
   }


   //* --------------- VALIDATE USER ---------------- 
   async validateUser(email: string, password: string) {
      const user = await this.userService.findOneByEmail(email)

      if (!user) {
         throw new UnauthorizedException("Invalid credentials!!")
      }

      const isPasswordMatched = await argon2.verify(user.password_hashed, password);
      if (!isPasswordMatched) {
         throw new UnauthorizedException("Invalid credentials!!")
      }
      if (user && isPasswordMatched) {
         const { password_hashed, ...result } = user
         return result
      }

      return null
   }


   //* ----------------GENERATE TOKEN -------------------
   async generateToken(userId: number) {
      const payload = { sub: userId };
      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(payload, this.authConfiguration),
         this.jwtService.signAsync(payload, this.refreshConfiguration)
      ]);

      return {
         accessToken,
         refreshToken
      };
   }



   //* ---------------------- LOGIN -----------------
   async login(userId: number) {
      const token = await this.generateToken(userId);
      return {
         userId,
         token
      }
   }

}
