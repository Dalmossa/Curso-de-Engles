import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import type { SessionPayload, RefreshResult } from './auth.service.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { Public } from '../../common/auth/public.decorator.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: { email: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionPayload> {
    const ip = req.ip;
    const meta = {
      userAgent: req.headers['user-agent'],
      ...(ip && { ipHash: Buffer.from(ip).toString('base64').slice(0, 32) }),
    };
    const result = await this.auth.login({ email: dto.email, password: dto.password }, meta);

    // Set refresh token as httpOnly cookie
    res.cookie('refresh_token', result.token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/auth/refresh',
    });

    return result;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body() dto: { email: string; password: string; displayName?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionPayload> {
    const registerInput: { email: string; password: string; displayName?: string } = {
      email: dto.email,
      password: dto.password,
    };
    if (dto.displayName !== undefined) {
      registerInput.displayName = dto.displayName;
    }
    const user = await this.auth.register(registerInput);

    const ip = req.ip;
    const meta = {
      userAgent: req.headers['user-agent'],
      ...(ip && { ipHash: Buffer.from(ip).toString('base64').slice(0, 32) }),
    };
    const result = await this.auth.createSessionForUser(user, meta);

    res.cookie('refresh_token', result.token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New access token and rotated refresh token' })
  @ApiResponse({ status: 401, description: 'Refresh token expired, revoked, or reuse detected' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string; expires_in: number; refresh_token: string }> {
    const refreshToken = req.cookies?.refresh_token ?? req.body?.refresh_token;

    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        type: 'about:blank',
        title: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
        detail: 'Refresh token required',
      });
      return { access_token: '', expires_in: 0, refresh_token: '' };
    }

    // Extract sessionId from refresh token (assuming JWT format or opaque token lookup)
    // For now, we'll use the token as sessionId for opaque token approach
    const result = await this.auth.refresh(refreshToken, refreshToken);

    // Set new refresh token cookie
    res.cookie('refresh_token', result.token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return {
      access_token: result.accessToken,
      expires_in: Math.floor((result.expiresAt.getTime() - Date.now()) / 1000),
      refresh_token: result.token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke session' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    const sessionId = req.sessionId;
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (sessionId && accessToken) {
      await this.auth.logout(sessionId, accessToken);
    }

    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async me(@Req() req: Request) {
    const sessionId = req.sessionId;
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!sessionId || !accessToken) {
      return null;
    }

    return this.auth.me(sessionId, accessToken);
  }
}