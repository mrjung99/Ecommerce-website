import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import type { ConfigType } from '@nestjs/config';
import authConfig from './configuration/authConfig';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './configuration/refreshConfig';
import * as argon2 from 'argon2';
import type { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { PasswordReset } from '../users/entities/password-reset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import crypto from 'crypto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    @Inject(refreshConfig.KEY)
    private readonly refreshConfiguration: ConfigType<typeof refreshConfig>,
    private readonly jwtService: JwtService,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepo: Repository<PasswordReset>,
    private readonly mailService: MailService,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  //* --------------- CREATE USER --------------
  async createUser(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  //* --------------------- VALIDATE USER ----------------
  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials!!');
    }

    const isPasswordMatched = await argon2.verify(user.password, password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials!!');
    }

    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  //* --------------------- LOGIN ----------------
  async login(userId: string, res: Response) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.saveHashedRefreshToken(userId, hashedRefreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  //* ----------------------- GENERATE TOKEN -----------------------
  async generateToken(userId: string) {
    const payload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, this.authConfiguration),
      this.jwtService.signAsync(payload, this.refreshConfiguration),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  //* ------------------------ REFRESH TOKEN ----------------------
  async refreshToken(userId: string, reqRefreshToken: string, res: Response) {
    const user = await this.userService.findUserById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenMatched = await argon2.verify(
      user.hashedRefreshToken,
      reqRefreshToken,
    );

    if (!isRefreshTokenMatched) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.saveHashedRefreshToken(userId, hashedRefreshToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  //* ---------------------------- FORGOT PASSWORD ------------------
  async requestRestPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const resetToken = this.passwordResetRepo.create({
      user: { id: user.id },
      tokenHash,
      expiresAt,
    });
    await this.passwordResetRepo.save(resetToken);

    const resetUrl = `${this.request.protocol}://${this.request.headers.host}/avi/v1/reset-password?token=${rawToken}`;

    await this.mailService.sendPasswordRest(user.email, resetUrl);
    return;
  }
}
