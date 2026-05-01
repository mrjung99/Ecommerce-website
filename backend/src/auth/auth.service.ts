import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import type { ConfigType } from '@nestjs/config';
import authConfig from './configuration/authConfig';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './configuration/refreshConfig';
import * as argon2 from 'argon2';
import { type Request, type Response } from 'express';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { Status } from '../users/enum/userStatus.enum';
import { OtpService } from '../otp/otp.service';
import { SessionService } from '../session/session.service';
import { User } from '../users/entities/user.entity';
import passwordResetConfig from './configuration/password-reset.config';
import { SendMailDto } from '../mail/dto/sendMail.dto';
import { Provider } from '../users/enum/provider.enum';
import { SetPasswordDto } from './dto/set-password.dto';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    @Inject(refreshConfig.KEY)
    private readonly refreshConfiguration: ConfigType<typeof refreshConfig>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
    private readonly sessionService: SessionService,
    @Inject(passwordResetConfig.KEY)
    private readonly resetPassConfig: ConfigType<typeof passwordResetConfig>,
  ) {}

  //* ------------------------- LOGIN (LOCAL) --------------------------
  async login(req: Request, dto: LoginDto, res: Response) {
    const user = await this.userService.findUserForLogin(dto.login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.password || user.provider === Provider.GOOGLE) {
      throw new UnauthorizedException(
        'This account uses Google login. Please set password first to login with email.',
      );
    }

    if (user.userStatus === Status.UNVERIFIED) {
      const otpInfo = await this.otpService.getOtpInfo(user.id);
      if (!otpInfo)
        throw new ForbiddenException('Unable to continue verification.');

      if (new Date(otpInfo.expiresAt) < new Date()) {
        await this.userService.resendOtp(user.email);
        throw new ForbiddenException(
          'Unable to continue verification. Please sign up or request a new OTP.',
        );
      } else {
        throw new ForbiddenException(
          'Please verify account first. A new OTP code has been sent to your email.',
        );
      }
    }

    const isValidPassword = await argon2.verify(user.password, dto.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials.');

    return this.issueToken(user, req, res);
  }

  //* ------------------ LOGIN (GOOGLE) ----------------------
  async googleLogin(
    googleUser: {
      email: string;
      firstName: string;
      lastName: string;
      googleId: string;
      avatarUrl: string;
    },
    req: Request,
    res: Response,
  ) {
    let user = await this.userService.findUserByEmail(googleUser.email);

    // FIRST LOGIN (if user not found it will register user)
    if (!user) {
      user = await this.userService.createGoogleUser(googleUser);
    } else {
      if (user.provider === 'local' && !user.googleId) {
        user.provider = Provider.GOOGLE_LOCAL;
        user.googleId = googleUser.googleId;

        if (user.profile && user.profile.avatarUrl == null) {
          user.profile.avatarUrl = googleUser.avatarUrl;
        }
        await this.userService.saveUser(user);
      }
    }

    const accessToken = await this.issueToken(user, req, res);

    res.redirect(`http://localhost:5173/login?token=${accessToken}`);
  }

  //* ------------- ISSUE TOKEN (SET COOKIE, INITIATE SESSION, SAVE SESSION) ---------------
  async issueToken(user: User, req: Request, res: Response) {
    const session = await this.sessionService.initiateSession(user, {
      ip: req.ip,
      device: req.headers['user-agent'],
    });

    const { accessToken, refreshToken } = await this.generateToken(
      user,
      session.id,
    );

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.sessionService.saveHashedSession(session.id, hashedRefreshToken);

    await this.setCookie(refreshToken, res);

    return accessToken;
  }

  //* -------------- SET COOKIE -------------
  async setCookie(refreshToken: string, res: Response) {
    return res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  //* ----------------------- GENERATE TOKEN -----------------------
  async generateToken(user: User, sessionId: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };

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
  async refreshToken(
    userId: string,
    sessionId: string,
    reqRefreshToken: string,
    res: Response,
  ) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidRefreshToken =
      await this.sessionService.verifyHashedRefreshToken(
        sessionId,
        reqRefreshToken,
      );

    if (!isValidRefreshToken) throw new UnauthorizedException();

    const { accessToken, refreshToken } = await this.generateToken(
      user,
      sessionId,
    );

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.sessionService.saveHashedSession(sessionId, hashedRefreshToken);

    this.setCookie(refreshToken, res);

    return accessToken;
  }

  //* --------------------- FORGOT PASSWORD ------------------
  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user)
      return { message: 'If user exists, password reset email will be sent.' };

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'password-reset',
    };

    const resetToken = await this.jwtService.signAsync(
      payload,
      this.resetPassConfig,
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.sendResetMail(user.email, resetLink, user.userName);

    return 'Please check your email to reset your password.';
  }

  //* ---------------- RESET PASSWORD -----------------
  async resetPassword(userId: string, newPassword: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const hashedPass = await argon2.hash(newPassword);

    await this.userService.updateResetPass(userId, hashedPass);

    return 'Password reset is successful.';
  }

  //* ---------------- RESET HTML ---------------------
  private passwordResetHtml(url: string, userName: string) {
    return `
      <h5>Dear, ${userName}</h5>
      <p>Click the link below to reset your Password.</p>
      <p>Click on this link: <a href="${url}">Link</a></p>
      <p>This link is only valid for 15 minutes.</p>
    `;
  }

  //* ----------------- SEND RESET EMAIL ---------------------
  private async sendResetMail(to: string, url: string, userName: string) {
    const dto: SendMailDto = {
      recipients: [to],
      subject: 'Password reset',
      html: this.passwordResetHtml(url, userName),
    };

    await this.mailService.sendMail(dto);
  }

  //* ------------------- SET PASSWORD ----------------
  async setPassword(userId: string, dto: SetPasswordDto) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.password) {
      throw new BadRequestException('Password already exist');
    }

    user.password = await argon2.hash(dto.password);

    if (user.provider === Provider.GOOGLE) {
      user.provider = Provider.GOOGLE_LOCAL;
    }

    await this.userService.saveUser(user);

    return 'Password set successfully.';
  }
}
