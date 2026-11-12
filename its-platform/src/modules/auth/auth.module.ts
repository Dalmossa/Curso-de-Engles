import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller.js';
import { JwksController } from './jwks.controller.js';
import { AuthService } from './auth.service.js';
import { UserEntity } from '../../infrastructure/entities/user.entity.js';
import { UserSessionEntity } from '../../infrastructure/entities/user-session.entity.js';
import { LearnerEntity } from '../../infrastructure/entities/learner.entity.js';
import { TOKEN_VERIFIER } from './tokens.js';
import { tokenVerifierFromEnv } from '../../infrastructure/auth/token-verifier-from-env.js';
import { DenyAllTokenVerifier } from '../../infrastructure/auth/deny-all-token-verifier.js';
import type { TokenVerifier } from '../../common/auth/token-principal.js';

export { TOKEN_VERIFIER };

/**
 * Which verifier the global guard gets.
 *
 * An external OIDC provider (`OIDC_*` complete) is the Resource-Server deployment: use it. With no
 * provider configured, the platform is running as its own Authorization Server (`AuthService`
 * mints the tokens and publishes their JWKS), so verification happens in-process against the same
 * key pair. The fallback is explicit rather than "whatever `tokenVerifierFromEnv` returned",
 * because a `DenyAllTokenVerifier` here would leave the login flow unable to call any API.
 */
function verifierFor(auth: AuthService): TokenVerifier {
  const fromEnv = tokenVerifierFromEnv();
  return fromEnv instanceof DenyAllTokenVerifier ? auth.tokenVerifier() : fromEnv;
}

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSessionEntity, LearnerEntity])],
  controllers: [AuthController, JwksController],
  providers: [
    AuthService,
    {
      provide: TOKEN_VERIFIER,
      inject: [AuthService],
      useFactory: verifierFor,
    },
  ],
  exports: [AuthService, TOKEN_VERIFIER],
})
export class AuthModule {}
