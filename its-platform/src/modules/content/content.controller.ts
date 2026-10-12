import { Controller, Get, Param, Query, BadRequestException, NotFoundException } from '@nestjs/common';
// Value import, not `import type`: `emitDecoratorMetadata` needs the class at runtime for
// Nest's constructor injection (the same reason `placement.controller.ts` imports its service).
import { ContentService } from './content.service.js';
import type {
  DialogueAudioContent,
  DialogueContent,
  LessonContent,
  PackContent,
} from './content.service.js';

/**
 * `dlg_…`, the same id shape `/content/listening/{dialogue_id}` publishes. A malformed value is
 * a `400` on the audio route (ADR-028 §7); the other two routes let the repository answer `null`
 * for anything, but this endpoint validates its own input.
 */
const DIALOGUE_ID_PATTERN = /^dlg_[a-z0-9_]+$/;

/** ADR-028 §2's accommodation pair. No other rate is rendered, so no other rate is accepted. */
const SUPPORTED_RATES: readonly number[] = [1, 0.75];
const DEFAULT_RATE = 1;

/**
 * P1.12 — the three `/content/*` reads (ADR-027 §1). Every response is the persisted catalogue,
 * read through `ContentRepository`; there is no mock and no file access anywhere on this path.
 *
 * The path parameter names are the OpenAPI `parameters[].name`s — `lesson_id`, `pack_id`,
 * `dialogue_id` — not the sketch's generic `id`. Nest matches `@Param` by name, and a rename here
 * is what keeps the generated client's argument names and the spec's in step.
 *
 * The 404 body is deliberately *not* RFC 9457 (ADR-027 §5): it is the shape the rest of the
 * platform already emits, and P1.17 owns the migration to Problem Details. The dialogue 404 is
 * the same body as an unknown id, so a caller cannot distinguish "no such dialogue" from
 * "exists, but not shipped" (ADR-027 §3).
 */
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('lessons/:lesson_id')
  async getLesson(@Param('lesson_id') lesson_id: string): Promise<LessonContent> {
    const lesson = await this.contentService.getLesson(lesson_id);
    if (!lesson) {
      throw new NotFoundException({
        error: 'not_found',
        message: 'Lesson not found',
        request_id: cryptoRandom(),
      });
    }
    return lesson;
  }

  @Get('packs/:pack_id')
  async getPack(@Param('pack_id') pack_id: string): Promise<PackContent> {
    const pack = await this.contentService.getPack(pack_id);
    if (!pack) {
      throw new NotFoundException({
        error: 'not_found',
        message: 'Pack not found',
        request_id: cryptoRandom(),
      });
    }
    return pack;
  }

  @Get('listening/:dialogue_id')
  async getDialogue(@Param('dialogue_id') dialogue_id: string): Promise<DialogueContent> {
    const dialogue = await this.contentService.getDialogue(dialogue_id);
    if (!dialogue) {
      // One body for "unknown id" and "exists, not `shipped`" (ADR-027 §3): the caller must not
      // be able to tell a withdrawn dialogue from a non-existent one.
      throw new NotFoundException({
        error: 'not_found',
        message: 'Dialogue not found',
        request_id: cryptoRandom(),
      });
    }
    return dialogue;
  }

  /**
   * P1.13 — the signed playlist of a dialogue's renders (ADR-028 §1/§3). The 10th published
   * path, and a resource of its own because a signed URL has a 300 s lifetime that a cacheable
   * catalog read (`DialogueContent`) must not carry.
   *
   * Two refusals are distinguished, and the ADR fixes which is which: a **malformed
   * `dialogue_id`** and an **unsupported `rate`** are `400`s (the caller is wrong about the
   * request), while every *admission* failure — unknown id, not `shipped`, no complete take, an
   * L2 render without an ear check — is the **same 404 body** as the sibling routes, so
   * "not admitted" cannot be probed for (ADR-028 §3).
   */
  @Get('listening/:dialogue_id/audio')
  async getDialogueAudio(
    @Param('dialogue_id') dialogue_id: string,
    @Query('rate') rate?: string,
  ): Promise<DialogueAudioContent> {
    if (!DIALOGUE_ID_PATTERN.test(dialogue_id)) {
      throw new BadRequestException({
        error: 'bad_request',
        message: 'Malformed dialogue_id',
        request_id: cryptoRandom(),
      });
    }

    const requested = rate === undefined ? DEFAULT_RATE : Number(rate);
    if (!SUPPORTED_RATES.includes(requested)) {
      throw new BadRequestException({
        error: 'bad_request',
        message: 'Unsupported rate; expected 1 or 0.75',
        request_id: cryptoRandom(),
      });
    }

    const audio = await this.contentService.getDialogueAudio(dialogue_id, requested);
    if (!audio) {
      throw new NotFoundException({
        error: 'not_found',
        message: 'Dialogue audio not found',
        request_id: cryptoRandom(),
      });
    }
    return audio;
  }
}

/** A `crypto` UUID where the global is present (Node ≥ 19), else the `crypto` module. */
function cryptoRandom(): string {
  const globalCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return globalCrypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
