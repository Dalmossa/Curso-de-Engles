import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';

/**
 * A5a — the module has no provider left. `AuthService` existed only to mint `mock_access_token`
 * for `POST /auth/refresh`, and §4.5 makes that issuance out of scope (see the controller). The
 * module stays, with its controller, because the published path stays.
 */
@Module({
  controllers: [AuthController],
})
export class AuthModule {}
