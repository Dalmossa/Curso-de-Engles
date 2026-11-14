/**
 * História 1 — cache em disco das sínteses, como decorador do port.
 *
 * Um TTS externo é o recurso mais caro da tela de lição e o mais previsível: a mesma frase, a
 * mesma voz e a mesma velocidade produzem sempre o mesmo áudio. Sem cache, cada abertura da
 * lição paga uma síntese por frase; com cache, paga uma vez.
 *
 * Três decisões:
 *
 * 1. **Decorador, não lógica no serviço.** `ContentService` continua vendo um único
 *    `SpeechSynthesizer`; quem decide *se* guarda é a composição do módulo. Trocar o cache por
 *    Redis amanhã é trocar esta classe, não o serviço.
 * 2. **Diretório temporário do sistema, nunca o repositório.** O cache é derivado e descartável;
 *    gravar em `./` faria dele parte do projeto, e o `.gitignore` de hoje não é a garantia.
 * 3. **Falha de cache não é falha de síntese.** `get`/`set` engolem erro de I/O: um disco cheio
 *    degrada a latência, não a funcionalidade.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import type {
  SpeechSynthesisAudio,
  SpeechSynthesisInput,
  SpeechSynthesisOutcome,
  SpeechSynthesizer,
} from './speech-synthesizer.js';

/** A chave é o conteúdo: voz + velocidade + texto. */
export function speechCacheKey(input: SpeechSynthesisInput): string {
  return createHash('sha256')
    .update(`${input.voice}\u0000${input.rate}\u0000${input.text}`, 'utf8')
    .digest('hex');
}

export interface SpeechAudioCache {
  get(key: string): Promise<SpeechSynthesisAudio | null>;
  set(key: string, audio: SpeechSynthesisAudio): Promise<void>;
}

const DEFAULT_MAX_ENTRIES = 256;

interface CachedAudioFile {
  mime_type: string;
  base64: string;
  duration_ms: number | null;
}

export interface DiskSpeechAudioCacheOptions {
  /** Default: `<tmpdir>/its-platform-tts-cache`. */
  readonly directory?: string;
  /** Teto de arquivos; acima disso os mais antigos por `mtime` saem. */
  readonly maxEntries?: number;
}

export class DiskSpeechAudioCache implements SpeechAudioCache {
  private readonly logger = new Logger(DiskSpeechAudioCache.name);
  private readonly directory: string;
  private readonly maxEntries: number;

  constructor(options: DiskSpeechAudioCacheOptions = {}) {
    this.directory = options.directory ?? join(tmpdir(), 'its-platform-tts-cache');
    this.maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
  }

  async get(key: string): Promise<SpeechSynthesisAudio | null> {
    try {
      const raw = await readFile(this.pathFor(key), 'utf8');
      const parsed = JSON.parse(raw) as Partial<CachedAudioFile>;
      if (typeof parsed.base64 !== 'string' || parsed.base64.length === 0) return null;
      return {
        mimeType: typeof parsed.mime_type === 'string' ? parsed.mime_type : 'audio/mpeg',
        base64: parsed.base64,
        durationMs: typeof parsed.duration_ms === 'number' ? parsed.duration_ms : null,
      };
    } catch {
      // Ausente é o caso normal (primeira síntese); ilegível é o caso raro. Os dois são "miss".
      return null;
    }
  }

  async set(key: string, audio: SpeechSynthesisAudio): Promise<void> {
    const target = this.pathFor(key);
    const temporary = `${target}.${process.pid}.tmp`;
    try {
      await mkdir(this.directory, { recursive: true });
      const payload: CachedAudioFile = {
        mime_type: audio.mimeType,
        base64: audio.base64,
        duration_ms: audio.durationMs,
      };
      // Escrita atômica: um leitor concorrente vê o arquivo antigo ou o novo, nunca um parcial.
      await writeFile(temporary, JSON.stringify(payload), 'utf8');
      await rename(temporary, target);
      await this.prune();
    } catch (error) {
      this.logger.warn(
        `TTS cache write skipped: ${error instanceof Error ? error.name : 'unknown error'}`,
      );
      void unlink(temporary).catch(() => undefined);
    }
  }

  private pathFor(key: string): string {
    return join(this.directory, `${key}.json`);
  }

  /** Poda preguiçosa: só quando o teto é ultrapassado, e nunca propaga o erro. */
  private async prune(): Promise<void> {
    const entries = await readdir(this.directory);
    if (entries.length <= this.maxEntries) return;

    const aged = await Promise.all(
      entries.map(async name => {
        const path = join(this.directory, name);
        const info = await stat(path).catch(() => null);
        return { path, modified: info?.mtimeMs ?? 0 };
      }),
    );
    aged.sort((a, b) => a.modified - b.modified);

    const excess = aged.slice(0, Math.max(0, aged.length - this.maxEntries));
    await Promise.all(excess.map(entry => unlink(entry.path).catch(() => undefined)));
  }
}

/**
 * O decorador que `ContentService` recebe no lugar do adaptador cru.
 *
 * Só resultados remotos entram no cache. Um `engine: 'none'` é a ausência de motor — guardá-lo
 * faria o primeiro erro virar o estado permanente da frase, que é o oposto de resiliência.
 */
export class CachedSpeechSynthesizer implements SpeechSynthesizer {
  constructor(
    private readonly inner: SpeechSynthesizer,
    private readonly cache: SpeechAudioCache,
  ) {}

  async synthesize(input: SpeechSynthesisInput): Promise<SpeechSynthesisOutcome> {
    const key = speechCacheKey(input);

    const cached = await this.cache.get(key);
    if (cached !== null) {
      return { engine: 'remote', audio: cached, fallbackReason: null };
    }

    const outcome = await this.inner.synthesize(input);
    if (outcome.engine === 'remote' && outcome.audio !== null) {
      await this.cache.set(key, outcome.audio);
    }
    return outcome;
  }
}
