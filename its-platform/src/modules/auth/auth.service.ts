import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async refreshToken() {
    return {
      access_token: 'mock_access_token',
      expires_in: 900,
    };
  }
}
