import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refreshToken() {
    return this.authService.refreshToken();
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
