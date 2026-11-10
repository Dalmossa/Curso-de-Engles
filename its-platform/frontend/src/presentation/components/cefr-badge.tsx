import type { CefrLevel } from '@/core';
import { Badge, type BadgeTone } from './ui/badge';
import { cefrLabel } from '../lib/copy';

const TONES: Readonly<Record<CefrLevel, BadgeTone>> = {
  A1: 'neutral',
  A2: 'neutral',
  B1: 'brand',
  B2: 'brand',
  C1: 'success',
  C2: 'success',
};

/**
 * The learner's band, or the honest statement that there isn't one yet.
 *
 * `null` renders as "Não avaliado" in a neutral tone. It is *not* defaulted to A1: a learner
 * who has not run the diagnostic has no band, and showing A1 would be a claim the platform
 * cannot support — the reason `cefr_level` is nullable in the contract at all.
 */
export function CefrBadge({ level, prefix }: { readonly level: CefrLevel | null; readonly prefix?: string }) {
  const text = cefrLabel(level);
  return (
    <Badge tone={level === null ? 'neutral' : TONES[level]} data-testid="cefr-badge">
      {prefix === undefined ? text : `${prefix} ${text}`}
    </Badge>
  );
}
