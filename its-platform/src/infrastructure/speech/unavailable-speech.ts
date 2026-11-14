/**
 * Os dois adaptadores "ausente" — o estado normal do ambiente bare-metal de hoje.
 *
 * Eles existem em vez de `null` porque a ausência é uma resposta de produto, não um erro de
 * programação: a História 1 cai para `speechSynthesis` no navegador, e a História 2 responde
 * `422` dizendo o que fazer. Um `null` no provedor faria o Nest falhar na injeção e transformaria
 * "recurso opcional ausente" em "API não sobe".
 */

import type { AsrOutcome, AsrTranscriber } from './asr-transcriber.js';
import type {
  SpeechSynthesisInput,
  SpeechSynthesisOutcome,
  SpeechSynthesizer,
} from './speech-synthesizer.js';
import { unavailableSynthesis } from './speech-synthesizer.js';

export class UnavailableSpeechSynthesizer implements SpeechSynthesizer {
  async synthesize(_input: SpeechSynthesisInput): Promise<SpeechSynthesisOutcome> {
    return unavailableSynthesis('not_configured');
  }
}

export class UnavailableAsrTranscriber implements AsrTranscriber {
  async transcribe(): Promise<AsrOutcome> {
    return { ok: false, reason: 'not_configured' };
  }
}
