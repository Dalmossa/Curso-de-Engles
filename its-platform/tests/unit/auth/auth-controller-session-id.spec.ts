/**
 * The session the access token belongs to, read from the one place the guard writes it.
 *
 * `JwtAuthGuard` (the global guard) puts the verified caller on `request.principal`; it never sets
 * a `sessionId` property. This controller read `req.sessionId` — always `undefined` — so `logout`
 * answered `{ ok: true }` while revoking nothing: the browser forgot its cookies and the refresh
 * token stayed valid for the rest of its 30 days. The bug was invisible over HTTP because the
 * response was both correct-looking and successful; only a second `refresh` with the token
 * "logged out" a moment earlier exposed it.
 *
 * The cases below pin the source of the id: the `sid` claim inside `principal.claims`. A test that
 * merely asserted "logout called `auth.logout`" with a fabricated `sessionId` property would have
 * passed against the broken code too.
 */

import type { Request, Response } from 'express';

import { AuthController } from '../../../src/modules/auth/auth.controller.js';
import type { AuthService } from '../../../src/modules/auth/auth.service.js';
import type { TokenPrincipal } from '../../../src/common/auth/token-principal.js';

const SESSION_ID = 'a94c1cda-2c5f-4cfb-a33c-c1c49136bac8';
const ACCESS_TOKEN = 'header.payload.signature';

interface AuthServiceMock {
  readonly logout: jest.Mock<Promise<void>, [string, string]>;
  readonly me: jest.Mock<Promise<unknown>, [string, string]>;
}

function createController(): { controller: AuthController; auth: AuthServiceMock } {
  const auth: AuthServiceMock = {
    logout: jest.fn(async (_sessionId: string, _accessToken: string): Promise<void> => {}),
    me: jest.fn(async (_sessionId: string, _accessToken: string): Promise<unknown> => ({ id: 'user-1' })),
  };
  const controller = new AuthController(auth as unknown as AuthService);
  return { controller, auth };
}

function requestWith(principal?: TokenPrincipal): Request {
  return {
    headers: { authorization: `Bearer ${ACCESS_TOKEN}` },
    ...(principal === undefined ? {} : { principal }),
  } as unknown as Request;
}

function principalWith(claims: Readonly<Record<string, unknown>>): TokenPrincipal {
  return { subject: 'learner-1', scopes: ['learner:self'], claims };
}

function responseMock(): Response {
  return { clearCookie: jest.fn() } as unknown as Response;
}

describe('AuthController — session id comes from the verified principal', () => {
  it('revokes the session named by the `sid` claim on logout', async () => {
    const { controller, auth } = createController();

    await controller.logout(requestWith(principalWith({ sid: SESSION_ID })), responseMock());

    expect(auth.logout).toHaveBeenCalledWith(SESSION_ID, ACCESS_TOKEN);
  });

  it('does not revoke anything when no principal was attached', async () => {
    const { controller, auth } = createController();

    const result = await controller.logout(requestWith(), responseMock());

    expect(auth.logout).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  it('ignores a `sid` claim that is not a non-empty string', async () => {
    const { controller, auth } = createController();

    await controller.logout(requestWith(principalWith({ sid: 42 })), responseMock());

    expect(auth.logout).not.toHaveBeenCalled();
  });

  it('reads the same claim on /auth/me', async () => {
    const { controller, auth } = createController();

    await controller.me(requestWith(principalWith({ sid: SESSION_ID })));

    expect(auth.me).toHaveBeenCalledWith(SESSION_ID, ACCESS_TOKEN);
  });

  it('answers null on /auth/me without a principal', async () => {
    const { controller, auth } = createController();

    await expect(controller.me(requestWith())).resolves.toBeNull();
    expect(auth.me).not.toHaveBeenCalled();
  });
});
