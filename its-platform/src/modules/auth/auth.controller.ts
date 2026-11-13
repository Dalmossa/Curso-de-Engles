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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import type { SessionPayload, RefreshResult } from './auth.service.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { Public } from '../../common/auth/public.decorator.js';
import type { TokenPrincipal } from '../../common/auth/token-principal.js';

/**
 * The guard writes the verified caller to `request.principal`; it does not write a `sessionId`
 * property. Reading `req.sessionId` (as this controller used to) therefore yielded `undefined` on
 * every request, which made `logout` answer `{ ok: true }` without revoking anything — a logout
 * that only *looks* like one. The `sid` claim is the session the access token belongs to
 * (`auth.service.ts` signs it), and `claims` is where the guard keeps it.
 */
type AuthenticatedRequest = Request & { principal?: TokenPrincipal };

function sessionIdOf(req: AuthenticatedRequest): string | undefined {
  const sid = req.principal?.claims['sid'];
  return typeof sid === 'string' && sid.length > 0 ? sid : undefined;
}

interface RevocationRequest {
  token: string;
  token_type_hint?: 'access_token' | 'refresh_token';
}

/** The `user_sessions.id` column is a UUID; a malformed id would otherwise reach Postgres and 500. */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    @Body() body: { refresh_token?: string; session_id?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string; expires_in: number; refresh_token: string }> {
    // The browser talks to the BFF, not to this API, so the `refresh_token` cookie scoped to
    // `/auth/refresh` never arrives here. The BFF forwards both the token and the session id it
    // stored at login. The refresh token itself is opaque, so the session id cannot be derived
    // from it — treating the token as the id (as this endpoint used to) always raised 401.
    const refreshToken = body?.refresh_token ?? req.cookies?.refresh_token;
    const sessionId = body?.session_id;

    if (!refreshToken || !sessionId) {
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token required');
      }
      throw new UnauthorizedException('Session id required');
    }

    if (!UUID_PATTERN.test(sessionId)) {
      throw new UnauthorizedException('Invalid session id');
    }

    const result = await this.auth.refresh(sessionId, refreshToken);

    // Set new refresh token cookie for direct (non-BFF) clients
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
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    const sessionId = sessionIdOf(req);
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (sessionId && accessToken) {
      await this.auth.logout(sessionId, accessToken);
    }

    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    return { ok: true };
  }

  /**
   * Token Revocation Endpoint (RFC 7009)
   *
   * Revokes an access token or refresh token. Per RFC 7009:
   * - The endpoint MUST accept application/x-www-form-urlencoded
   * - The token parameter is REQUIRED
   * - The token_type_hint parameter is OPTIONAL
   * - Returns 200 on success (even if token was already revoked or invalid)
   * - Response body is empty
   */
  @Public()
  @Post('revocation')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string', description: 'The token to revoke' },
        token_type_hint: {
          type: 'string',
          enum: ['access_token', 'refresh_token'],
          description: 'Hint about the type of token (optional)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Revoke a token (RFC 7009)' })
  @ApiResponse({ status: 200, description: 'Token revoked successfully (or was already invalid)' })
  async revoke(
    @Body() dto: RevocationRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    // RFC 7009: The authorization server MAY ignore unrecognized token_type_hint values
    // We accept both access_token and refresh_token, ignore others
    const tokenTypeHint = dto.token_type_hint === 'access_token' || dto.token_type_hint === 'refresh_token'
      ? dto.token_type_hint
      : undefined;

    await this.auth.revokeToken(dto.token, tokenTypeHint);

    // Per RFC 7009, return 200 with empty body
    res.status(HttpStatus.OK).send();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async me(@Req() req: AuthenticatedRequest) {
    const sessionId = sessionIdOf(req);
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!sessionId || !accessToken) {
      return null;
    }

    return this.auth.me(sessionId, accessToken);
  }
}