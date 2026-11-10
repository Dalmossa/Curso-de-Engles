const PERCENT_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 0,
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

/** `0.85` → `"85%"`. Rounds to whole percent: a mastery bar does not need decimals. */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return PERCENT_FORMATTER.format(Math.min(Math.max(value, 0), 1));
}

export function formatDurationMinutes(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return '—';
  return `${minutes} min`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return DATE_TIME_FORMATTER.format(parsed);
}

/**
 * Turns an identifier the server owns into something readable, for the case where
 * it is not one of the ids the UI already has a label for.
 *
 * `vocab.meeting.standup_timebox` → `Vocab meeting standup timebox`
 */
export function humanizeIdentifier(identifier: string): string {
  const words = identifier
    .replace(/^(les|mod|pack|dlg|lst|v)_/i, '')
    .split(/[._\-/]+/)
    .filter(Boolean);
  if (words.length === 0) return identifier;
  return words
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

/** First code point, uppercased — `A` from `A2`. Used for CEFR badges. */
export function initial(value: string): string {
  return value.slice(0, 1).toUpperCase();
}
