import { cn } from '@/shared/utils/cn';

export type ProgressTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Readonly<Record<ProgressTone, string>> = {
  brand: 'bg-brand-500',
  success: 'bg-success-600',
  warning: 'bg-warning-500',
  danger: 'bg-danger-600',
  neutral: 'bg-ink-400',
};

export interface ProgressProps {
  /** 0..1. Clamped here rather than trusted. */
  readonly value: number;
  /**
   * Rendered instead of the percentage. `null` for a value that is not a percentage at
   * all — a CEFR level, say.
   */
  readonly label?: string | null;
  readonly ariaLabel: string;
  readonly tone?: ProgressTone;
  readonly className?: string;
}

/**
 * A single-value meter, implemented on the ARIA `progressbar` pattern rather than with a
 * component library: the accessible name, the min/max and the formatted value are the
 * whole of what a screen reader needs, and a div with three attributes gets all three
 * without dragging a client boundary into an otherwise server-rendered page.
 *
 * `aria-valuetext` carries the label so a screen reader announces "Gramática: 72%" rather
 * than the raw ratio, and the visible copy of that same string is `aria-hidden` because the
 * meter has already said it — otherwise the row is read out twice.
 */
export function Progress({ value, label, ariaLabel, tone = 'brand', className }: ProgressProps) {
  const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0;
  const percentage = Math.round(clamped * 100);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-valuetext={label === null || label === undefined ? `${percentage}%` : label}
        className="h-2 min-w-24 flex-1 overflow-hidden rounded-full bg-surface-sunken"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-300', TONES[tone])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span aria-hidden="true" className="w-14 shrink-0 text-right text-sm tabular-nums text-ink-700">
        {label ?? `${percentage}%`}
      </span>
    </div>
  );
}
