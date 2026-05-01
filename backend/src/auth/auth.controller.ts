import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Res,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { RefreshAuthGuard } from './guard/refresh.auth.guard';
import { Public } from './decorator/public.decorator';
import { Throttle } from '@nestjs/throttler';
import type { RefreshRequest } from './interface/refresh-request.interface';
import { LoginDto } from './dto/login.dto';
import { PasswordResetGuard } from './guard/password-reset.guard';
import { SessionService } from '../session/session.service';
import { GoogleAuthGuard } from './guard/google-oauth.guard';
import { SetPasswordDto } from './dto/set-password.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  //* --------------- LOGIN ---------------
  @Public()
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login (normal)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async login(
    @Req() req: any,
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.login(req, dto, res);
    return { status: 'success', message: 'Login successful!!', accessToken };
  }

  //* ---------------- LOGIN WITH GOOGLE -----------
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @ApiOperation({ summary: 'Login (google)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async googleLogin() {}

  //* ------------- GOOGLE LOGIN CALLBACK --------------
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Call back for google login',
    description: 'This will automatically called by the google login route.',
  })
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const googleUser = req.user;

    const accessToken = await this.authService.googleLogin(
      googleUser,
      req,
      res,
    );

    return {
      success: true,
      message: 'Login successful.',
      accessToken,
    };
  }

  //* --------------- REFRESH ROUTE ---------------
  @Public()
  @Throttle({ short: { ttl: 60000, limit: 20 } })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user.id;
    const sessionId = req.user.sessionId;
    const refreshToken = req.user.refreshToken;

    const accessToken = await this.authService.refreshToken(
      userId,
      sessionId,
      refreshToken,
      res,
    );

    return { success: true, accessToken };
  }

  // //* -------------------- FORGOT PASSWORD ------------------
  @Public()
  @Post('forgot-password')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async forgotPassword(@Body('email') email: string) {
    const passwordResetToken = await this.authService.forgotPassword(email);

    return {
      success: true,
      passwordResetToken,
    };
  }

  //* ---------------- RESET PASSWORD ---------------
  @Public()
  @UseGuards(PasswordResetGuard)
  @Post('reset-password')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async resetPassword(@Req() req: any, @Body('password') password: string) {
    const message = await this.authService.resetPassword(
      req.user.userId,
      password,
    );
    return {
      success: true,
      message,
    };
  }

  //* ------------------- LOGOUT (SINGLE DEVICE) -----------------
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Logout (single device)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.user.sessionId;
    if (!sessionId) {
      throw new UnauthorizedException('No active session found.');
    }

    await this.sessionService.revokeSession(sessionId);
    res.clearCookie('refreshToken');

    return {
      success: true,
      message: 'Logged out successfully.',
    };
  }

  //* ------------------ LOGOUT FROM ALL SESSION -------------
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Logout (Multiple device)' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logoutAll(@Req() req, @Res() res: Response) {
    const userId = req.user.userId;
    await this.sessionService.revokeAllSession(userId);
    res.clearCookie('refreshToken');

    return {
      success: true,
      message: 'Logged out from all device.',
    };
  }

  //* ------------- SET PASSWORD ---------------
  @Post('set-password')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Set Password' })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: ' not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async setPassword(@Req() req, @Body() dto: SetPasswordDto) {
    const res = await this.authService.setPassword(req.user.id, dto);

    return {
      success: true,
      message: res,
    };
  }
}
