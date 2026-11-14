import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContentController } from './content.controller.js';
import { ContentService } from './content.service.js';
import { ContentRepository } from '../../infrastructure/repositories/content.repository.js';
import { AUDIO_URL_SIGNER } from '../../infrastructure/audio/audio-url-signer.js';
import { HmacAudioUrlSigner } from '../../infrastructure/audio/hmac-audio-url-signer.js';
import { SPEECH_SYNTHESIZER } from '../../infrastructure/speech/speech-synthesizer.js';
import { HttpSpeechSynthesizer } from '../../infrastructure/speech/http-speech-synthesizer.js';
import {
  CachedSpeechSynthesizer,
  DiskSpeechAudioCache,
} from '../../infrastructure/speech/tts-cache.js';
import { UnavailableSpeechSynthesizer } from '../../infrastructure/speech/unavailable-speech.js';

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
 *
 * The same shape carries História 1's TTS port (`SPEECH_SYNTHESIZER`): `TTS_SERVICE_URL` set ⇒
 * HTTP adapter wrapped in the disk cache; unset ⇒ the explicit "unavailable" adapter, which is
 * what makes the endpoint answer `engine: 'none'` so the browser can fall back to
 * `window.speechSynthesis`. The cache lives in the OS temp directory, never in the repository:
 * it is derived data, and a `.gitignore` entry is not an ownership boundary.
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
    {
      provide: SPEECH_SYNTHESIZER,
      useFactory: (config: ConfigService) => {
        const baseUrl = config.get<string>('TTS_SERVICE_URL');
        if (baseUrl === undefined || baseUrl.trim() === '') {
          return new UnavailableSpeechSynthesizer();
        }
        return new CachedSpeechSynthesizer(
          new HttpSpeechSynthesizer({ baseUrl }),
          new DiskSpeechAudioCache(),
        );
      },
      inject: [ConfigService],
    },
    ContentService,
  ],
  exports: [ContentService],
})
export class ContentModule {}
