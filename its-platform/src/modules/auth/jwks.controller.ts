import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { Public } from '../../common/auth/public.decorator.js';

@ApiTags('auth')
@Controller()
export class JwksController {
  constructor(private readonly auth: AuthService) {}

  @Get('.well-known/jwks.json')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get JWKS for token verification' })
  async jwks(): Promise<{ keys: unknown[] }> {
    return this.auth.getJwks();
  }
}