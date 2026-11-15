import type { ForgotPasswordResult, PasswordResetRepository, ResetPasswordInput, ResetPasswordResult } from '@/core';
import type { ApiTransport } from '../api-transport';
import {
  toForgotPasswordResult,
  toResetPasswordResult,
  type ForgotPasswordRequestDto,
  type ForgotPasswordResponseDto,
  type ResetPasswordRequestDto,
  type ResetPasswordResponseDto,
} from '../mappers';

/**
 * The HTTP adapter for the password recovery operations.
 *
 * Both operations are public on the API, and the transport that satisfies this repository
 * is built without a bearer token — see `infrastructure/composition/server-container.ts`.
 * The person asking for a new password is not signed in, and presenting somebody else's
 * credential would make the API answer for that other person.
 */
export class HttpPasswordResetRepository implements PasswordResetRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async requestReset(email: string): Promise<ForgotPasswordResult> {
    const body: ForgotPasswordRequestDto = { email };
    const dto = await this._transport.request<ForgotPasswordResponseDto>({
      operation: 'auth.forgotPassword',
      body,
    });
    return toForgotPasswordResult(dto);
  }

  async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResult> {
    const body: ResetPasswordRequestDto = {
      token: input.token,
      newPassword: input.newPassword,
    };
    const dto = await this._transport.request<ResetPasswordResponseDto>({
      operation: 'auth.resetPassword',
      body,
    });
    return toResetPasswordResult(dto);
  }
}
