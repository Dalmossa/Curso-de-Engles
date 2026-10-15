import { Controller, NotImplementedException, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  /**
   * `501 Not Implemented` — the answer three documents already described and the code did not give.
   *
   * `CONSTITUTION.md` §4.5 puts this operation out of the MVP: the API is a **Resource Server** that
   * *"does not issue tokens"*, and `/auth/refresh` is named as out of scope. The canonical contract
   * says the same twice over — `x-mvp-scope: excluded` with `x-blocked-by: ADR-013`, a `501` response
   * reading *"Not implemented. The MVP is a Resource Server and does not issue tokens"*, and a
   * description that tells an implementer *"Do not implement"*. Until A5a this method answered `200`
   * with `{access_token: 'mock_access_token', expires_in: 900}`: a value shaped like a bearer token,
   * issued by an API that must never issue one — a client that trusted it would send it as
   * credentials. The mock is gone with `AuthService`.
   *
   * The **path** stays published, and the contract's own description gives the reason: removing a
   * published path is a breaking change under §4.4, and ADR-013 authorises no such removal. When
   * ADR-013 resolves, the operation's declared `200` is the shape to implement; until then this
   * response is the honest one.
   *
   * The message is left to the exception's default — `ProblemExceptionFilter` takes `title` from the
   * status phrase (RFC 9457 §4.2.1) and omits `detail` for every 5xx, so nothing internal is
   * serialised (ADR-034; `reports/api/fase-4.md` §2).
   */
  @Post('refresh')
  refresh(): never {
    throw new NotImplementedException();
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
