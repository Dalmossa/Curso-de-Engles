import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
// Value import, not `import type`: `emitDecoratorMetadata` needs the class at runtime for
// Nest's constructor injection (the same reason `placement.controller.ts` imports its service).
import { ContentService } from './content.service.js';
import type { DialogueContent, LessonContent, PackContent } from './content.service.js';

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
}

/** A `crypto` UUID where the global is present (Node ≥ 19), else the `crypto` module. */
function cryptoRandom(): string {
  const globalCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return globalCrypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
