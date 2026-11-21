import lookup from './dialogue-clip-lookup.json';

type ClipEntry = { clipId: string; dialogueId: string; sortIndex: number; speaker?: string };
type LookupData = {
  bySpeakerText: Record<string, ClipEntry>;
  byText: Record<string, ClipEntry[]>;
};

const data = lookup as unknown as LookupData;

function norm(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

const DEFAULT_AUDIO_BASE = 'http://192.168.0.6:3200';

export function getAudioBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_AUDIO_BASE_URL;
  if (env && env.trim()) return env.trim().replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    // In browser dev/LAN, infer same host on port 3200 when not configured.
    const { protocol, hostname } = window.location;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}:3200`;
    }
  }
  return DEFAULT_AUDIO_BASE;
}

export function resolveDialogueClipUrl(speaker: string, text: string): string | null {
  const key = `${norm(speaker)}|${norm(text)}`;
  let entry = data.bySpeakerText[key];
  if (!entry) {
    const candidates = data.byText[norm(text)];
    if (candidates && candidates.length === 1) entry = candidates[0];
    else if (candidates && candidates.length > 1) {
      entry = candidates.find((c) => norm(c.speaker ?? '') === norm(speaker)) ?? candidates[0];
    }
  }
  if (!entry) return null;
  const base = getAudioBaseUrl();
  return `${base}/catalog/render/${entry.clipId}/take-1.opus`;
}
