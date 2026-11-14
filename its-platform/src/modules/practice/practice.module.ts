import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PracticeController } from './practice.controller.js';
import { PracticeService } from './practice.service.js';
import { PronunciationController } from './pronunciation.controller.js';
import { PronunciationService } from './pronunciation.service.js';
import { LearnersModule } from '../learners/learners.module.js';
import { ContentModule } from '../content/content.module.js';
import { ASR_TRANSCRIBER } from '../../infrastructure/speech/asr-transcriber.js';
import { HttpAsrTranscriber } from '../../infrastructure/speech/http-asr-transcriber.js';
import { UnavailableAsrTranscriber } from '../../infrastructure/speech/unavailable-speech.js';

// `LearnersModule` supplies `LearnerScopeService`: a submission is only scored once the addressed
// learner has been resolved under the caller's RLS context (ADR-038 D3).
// `ContentModule` supplies `ContentService` to fetch pack content for grading.
//
// `ASR_TRANSCRIBER` is bound by configuration: `ASR_SERVICE_URL` set ⇒ the HTTP adapter; unset ⇒
// the explicit "unavailable" adapter, so the route answers `422` with an honest message instead of
// pretending to score. A `null` provider would make Nest fail to construct the service and turn
// "optional capability absent" into "the API does not boot" (see `unavailable-speech.ts`).
@Module({
  imports: [LearnersModule, ContentModule],
  controllers: [PracticeController, PronunciationController],
  providers: [
    PracticeService,
    PronunciationService,
    {
      provide: ASR_TRANSCRIBER,
      useFactory: (config: ConfigService) => {
        const baseUrl = config.get<string>('ASR_SERVICE_URL');
        if (baseUrl === undefined || baseUrl.trim() === '') {
          return new UnavailableAsrTranscriber();
        }
        return new HttpAsrTranscriber({
          baseUrl,
          apiKey: config.get<string>('ASR_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class PracticeModule {}
