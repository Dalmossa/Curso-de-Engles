import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

const TONES: Readonly<Record<BadgeTone, string>> = {
  neutral: 'bg-surface-sunken text-ink-700 ring-border-subtle',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-success-50 text-success-700 ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  danger: 'bg-danger-50 text-danger-700 ring-danger-200',
};

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  readonly tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
