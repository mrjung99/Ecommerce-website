import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import authConfig from './config/authConfig';
import { UserService } from 'src/user/user.service';
import argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refreshConfig';
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
   async generateToken(userId: string) {
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
   async login(userId: string) {
      const { accessToken, refreshToken } = await this.generateToken(userId);
      const hashedRefreshToken = await argon2.hash(refreshToken);

      await this.userService.updateRefreshToken(userId, hashedRefreshToken)

      return {
         userId,
         accessToken,
         refreshToken
      };
   }


   //* ---------------------- REFRESH TOKEN -----------------
   async getRefreshToken(userId: string) {
      const user = await this.userService.findOne(userId);
      if (!user) {
         throw new NotFoundException("User not found!!");
      }

      const { accessToken, refreshToken } = await this.generateToken(userId);
      const hashedRefreshToken = await argon2.hash(refreshToken);
      await this.userService.updateRefreshToken(userId, hashedRefreshToken);

      return {
         userId: user.id,
         accessToken,
         refreshToken
      };
   }



   //* ---------------- COMPARE REFRESH TOKEN ------------
   async compareRefreshToken(userId: string, refreshToken: string) {
      const user = await this.userService.findOne(userId);

      if (!user || !user?.hashedRefreshToken) {
         throw new UnauthorizedException()
      };

      const isPasswordMatched = await argon2.verify(user.hashedRefreshToken, refreshToken);

      if (!isPasswordMatched) throw new UnauthorizedException();

      return { userId };
   }

}
