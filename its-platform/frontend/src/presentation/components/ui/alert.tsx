import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type AlertTone = 'info' | 'warning' | 'danger' | 'success';

const TONES: Readonly<Record<AlertTone, string>> = {
  info: 'border-brand-200 bg-brand-50 text-brand-900',
  warning: 'border-warning-200 bg-warning-50 text-warning-900',
  danger: 'border-danger-200 bg-danger-50 text-danger-900',
  success: 'border-success-200 bg-success-50 text-success-900',
};

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  readonly tone?: AlertTone;
  readonly title: ReactNode;
  readonly icon?: ReactNode;
}

/**
 * `role="alert"` is reserved for the danger tone. An alert interrupts whatever a screen
 * reader is doing, and a page whose every notice interrupts is a page nobody can read.
 */
export function Alert({ tone = 'info', title, icon, className, children, ...props }: AlertProps) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-lg border p-4 text-sm', TONES[tone], className)}
      {...props}
    >
      {icon === undefined ? null : <span aria-hidden="true" className="mt-0.5 shrink-0">{icon}</span>}
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        {children === undefined ? null : <div className="[&_p]:leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
