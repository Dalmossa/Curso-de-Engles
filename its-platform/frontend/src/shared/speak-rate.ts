import { readStoredValue, writeStoredValue } from './utils/storage';

export type SpeakRate = 1 | 0.75 | 0.5;

export const SPEAK_RATE_STORAGE_KEY = 'its-speak-rate';

/** Rates the remote TTS/content API accepts. */
export type SynthesisRate = 1 | 0.75;

export function isSpeakRate(value: unknown): value is SpeakRate {
  return value === 1 || value === 0.75 || value === 0.5;
}

export function parseSpeakRate(value: string | null): SpeakRate {
  if (value === '0.5') return 0.5;
  if (value === '0.75') return 0.75;
  return 1;
}

export function readStoredSpeakRate(): SpeakRate {
  return parseSpeakRate(readStoredValue(SPEAK_RATE_STORAGE_KEY));
}

export function writeStoredSpeakRate(rate: SpeakRate): void {
  writeStoredValue(SPEAK_RATE_STORAGE_KEY, String(rate));
}

/**
 * Maps a user playback rate to the closest synthesis rate supported by the TTS API.
 * 0.5x playback requests 0.75 synthesis (slowest available), then client playbackRate
 * is adjusted to reach the target speed.
 */
export function toSynthesisRate(rate: SpeakRate): SynthesisRate {
  return rate === 0.5 ? 0.75 : rate;
}

/** Playback multiplier to apply on audio returned by synthesis. */
export function playbackMultiplier(target: SpeakRate, synthesisRate: number): number {
  if (!Number.isFinite(synthesisRate) || synthesisRate <= 0) return target;
  const multiplier = target / synthesisRate;
  // Keep within reasonable browser audio bounds.
  return Math.min(2, Math.max(0.25, multiplier));
}
