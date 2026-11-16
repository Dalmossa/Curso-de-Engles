import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  HttpCode,
  Post,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SCOPES, Scopes } from '../../common/auth/scopes.decorator.js';
// Value import, not `import type`: `emitDecoratorMetadata` needs the class at runtime for
// Nest's constructor injection (the same reason `placement.controller.ts` imports its service).
import { ContentService } from './content.service.js';
import type {
  DialogueAudioContent,
  DialogueContent,
  GrammarTipContent,
  LessonContent,
  PackContent,
  SpeechSynthesisContent,
} from './content.service.js';
import { SpeechSynthesisDto } from './dto/speech-synthesis.dto.js';

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
 * P1.12 — the three `/content/*` reads (ADR-027 §1). Every response is the
 * persisted lesson, pack or dialogue read from the repository.
 *
 * Errors carry no body of their own: the throw states the occurrence's message and the global
 * `ProblemExceptionFilter` renders it as RFC 9457 `Problem` (§4.3, P1.17). Before A4 these six
 * throws each built `{error, message, request_id}` — a second error shape, one `crypto` UUID per
 * *throw*, and a `request_id` the filter then discarded. The ADR-027 §3 invariant they exist for is
 * unchanged: unknown id and "exists but not `shipped`" produce the same status *and the same
 * detail*, so a caller cannot probe for the difference.
 *
 * The path parameter names are the OpenAPI `parameters[].name`s — `lesson_id`, `pack_id`,
 * `dialogue_id` — not the sketch's generic `id`. Nest matches `@Param` by name, and a rename here
 * is what keeps the generated client's argument names and the spec's in step.
 */
// ADR-038 D1: the catalogue is **not** public. It is the product, and an anonymous reader of it
// has no named consumer (R3) — so it carries its own scope rather than an `@Public()`, and the
// reversal (should one be named) is the permissive direction, which is not breaking.
@Scopes(SCOPES.contentRead)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('lessons/:lesson_id')
  async getLesson(@Param('lesson_id') lesson_id: string): Promise<LessonContent> {
    const lesson = await this.contentService.getLesson(lesson_id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  @Get('packs/:pack_id')
  async getPack(@Param('pack_id') pack_id: string): Promise<PackContent> {
    const pack = await this.contentService.getPack(pack_id);
    if (!pack) {
      throw new NotFoundException('Pack not found');
    }
    return pack;
  }

  @Get('listening/:dialogue_id')
  async getDialogue(@Param('dialogue_id') dialogue_id: string): Promise<DialogueContent> {
    const dialogue = await this.contentService.getDialogue(dialogue_id);
    if (!dialogue) {
      // One body for "unknown id" and "exists, not `shipped`" (ADR-027 §3): the caller must not
      // be able to tell a withdrawn dialogue from a non-existent one.
      throw new NotFoundException('Dialogue not found');
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
      throw new BadRequestException('Malformed dialogue_id');
    }

    const requested = rate === undefined ? DEFAULT_RATE : Number(rate);
    if (!SUPPORTED_RATES.includes(requested)) {
      throw new BadRequestException('Unsupported rate; expected 1 or 0.75');
    }

    const audio = await this.contentService.getDialogueAudio(dialogue_id, requested);
    if (!audio) {
      throw new NotFoundException('Dialogue audio not found');
    }
    return audio;
  }

  /**
   * História 1 — `POST /content/tts`. A phrase in, a synthesized render (or an explicit "no engine
   * here") out.
   *
   * `POST` rather than `GET` because the request carries a phrase of up to 500 characters: a query
   * string would put lesson text into access logs, browser history and `Referer` headers, and the
   * phrase is content, not an identifier.
   *
   * `200` for the same reason as the `/practice` routes: the contract publishes one success status,
   * and a synthesis creates no addressable resource. The `200` also carries the fallback case — an
   * absent engine is a designed outcome, not a server error, and answering `5xx` would take the
   * lesson screen down for a capability the browser can provide itself.
   */

  /**
   * Frente 3 — apoio gramatical sob demanda via RAG local.
   *
   * O conteúdo vem do utilitário local (ChromaDB/fastembed) e nunca de fontes externas em tempo
   * de execução. Se o ambiente não tiver o `.venv`/índice disponível, a resposta é graciosa
   * (`tips: []`) em vez de erro 5xx, preservando a disponibilidade do endpoint.
   */
  @Get('grammar-tip')
  async getGrammarTip(@Query('topic') topic?: string): Promise<GrammarTipContent> {
    const cleanTopic = typeof topic === 'string' ? topic.trim() : '';
    if (cleanTopic.length === 0 || cleanTopic.length > 120) {
      throw new BadRequestException('Query parameter "topic" is required (1-120 characters).');
    }
    return this.contentService.getGrammarTip(cleanTopic);
  }

  @Post('tts')
  @HttpCode(200)
  async synthesizeSpeech(@Body() body: SpeechSynthesisDto): Promise<SpeechSynthesisContent> {
    return this.contentService.synthesizeSpeech(body.text, body.voice, body.rate);
  }
}
