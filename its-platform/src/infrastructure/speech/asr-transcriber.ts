/**
 * História 2 — a porta de transcrição (ASR), deliberadamente separada do *scoring*.
 *
 * O reconhecimento de fala é o que transforma áudio em texto; o que se faz com esse texto é
 * domínio (`pronunciation-scorer.ts`). Manter os dois atrás de portas diferentes é o que permite
 * testar a avaliação inteira sem microfone, sem rede e sem fornecedor, e é o que permite trocar
 * Whisper local por um serviço gerenciado sem tocar no algoritmo.
 *
 * O desfecho tem dois ramos e o motivo da falha é explícito porque os dois casos pedem mensagens
 * diferentes ao aprendiz: `not_configured` é "este ambiente ainda não avalia áudio" e
 * `upstream_error` é "o avaliador falhou agora, tente de novo".
 */

export type AsrFailureReason = 'not_configured' | 'upstream_error';

export type AsrOutcome =
  | { readonly ok: true; readonly transcript: string }
  | { readonly ok: false; readonly reason: AsrFailureReason };

export interface AsrTranscriptionInput {
  readonly audioBase64: string;
  readonly mimeType: string;
  /** BCP-47 do que se espera ouvir, por exemplo `en-US`. */
  readonly locale: string;
}

export interface AsrTranscriber {
  transcribe(input: AsrTranscriptionInput): Promise<AsrOutcome>;
}

/** Token de DI da porta; o módulo liga o adaptador escolhido a ele. */
export const ASR_TRANSCRIBER = Symbol('ASR_TRANSCRIBER');
