import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContentController } from './content.controller.js';
import { ContentService } from './content.service.js';
import { ContentRepository } from '../../infrastructure/repositories/content.repository.js';
import { AUDIO_URL_SIGNER } from '../../infrastructure/audio/audio-url-signer.js';
import { HmacAudioUrlSigner } from '../../infrastructure/audio/hmac-audio-url-signer.js';

/**
 * P1.13 — the content module gains the `AudioUrlSigner` port (ADR-028 §5/§Implementation Plan B).
 *
 * `ContentService` injects the **port token**, never `HmacAudioUrlSigner`: the S3-presign
 * adapter ADR-028 §5 defers to M3 then lands by swapping this one provider, with the service,
 * the controller and the contract untouched.
 *
 * The key and base URL come from configuration — `AUDIO_URL_SIGNING_KEY` (a KMS-rotated secret
 * in deployed environments) and `AUDIO_BASE_URL` (the origin/CDN seam, environment-specific) —
 * and the adapter fails closed at construction if either is empty.
 */
@Module({
  imports: [ConfigModule],
  controllers: [ContentController],
  providers: [
    ContentRepository,
    {
      provide: AUDIO_URL_SIGNER,
      useFactory: (config: ConfigService) =>
        new HmacAudioUrlSigner({
          // Deliberately NOT `?? ''`: the signer treats an unset value as "fall back outside
          // production / fail closed in production" (ADR-028 §5), and `''` would force the
          // failure even in dev.
          signingKey: config.get<string>('AUDIO_URL_SIGNING_KEY'),
          baseUrl: config.get<string>('AUDIO_BASE_URL'),
        }),
      inject: [ConfigService],
    },
    ContentService,
  ],
  exports: [ContentService],
})
export class ContentModule {}
