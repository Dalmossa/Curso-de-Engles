import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeController } from './practice.controller.js';
import { PracticeService } from './practice.service.js';
import { PronunciationController } from './pronunciation.controller.js';
import { PronunciationService } from './pronunciation.service.js';
import { LearnersModule } from '../learners/learners.module.js';
import { ASR_TRANSCRIBER } from '../../infrastructure/speech/asr-transcriber.js';
import { HttpAsrTranscriber } from '../../infrastructure/speech/http-asr-transcriber.js';
import { UnavailableAsrTranscriber } from '../../infrastructure/speech/unavailable-speech.js';
import { PronunciationAttemptEntity } from '../../infrastructure/entities/pronunciation-attempt.entity.js';

// `LearnersModule` supplies `LearnerScopeService`: a submission is only scored once the addressed
// learner has been resolved under the caller's RLS context (ADR-038 D3). The pack, its items and
// their keys are read through that same transaction — `withVisible`'s `QueryRunner` — so this
// module needs no `DataSource` of its own, and no `ContentService`: grading needs the `key` column,
// which is a scoring concern (the answer), not a content concern, and ADR-044 keeps it off the
// catalog read on purpose.
@Module({
  imports: [LearnersModule, TypeOrmModule.forFeature([PronunciationAttemptEntity])],
  controllers: [PracticeController, PronunciationController],
  providers: [
    PracticeService,
    PronunciationService,
    {
      provide: ASR_TRANSCRIBER,
      useFactory: (config: ConfigService) => {
        // `ASR_SERVICE_URL` opt-in, the same shape as `TTS_SERVICE_URL` in `ContentModule`: set it
        // and the HTTP adapter is used; leave it unset and the endpoint answers `422` on audio-only
        // requests — which is the designed, honest path when no engine is deployed. The controller
        // still works in that state, because the browser can always send a `transcript`.
        const baseUrl = config.get<string>('ASR_SERVICE_URL');
        if (baseUrl === undefined || baseUrl.trim() === '') {
          return new UnavailableAsrTranscriber();
        }
        return new HttpAsrTranscriber({ baseUrl });
      },
      inject: [ConfigService],
    },
  ],
})
export class PracticeModule {}
