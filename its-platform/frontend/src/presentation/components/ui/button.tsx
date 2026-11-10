import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ' +
  'disabled:cursor-not-allowed disabled:opacity-55';

const VARIANTS: Readonly<Record<ButtonVariant, string>> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary: 'bg-surface-sunken text-ink-900 hover:bg-border-subtle',
  ghost: 'text-ink-700 hover:bg-surface-sunken',
  danger: 'bg-danger-600 text-white hover:bg-danger-700',
};

const SIZES: Readonly<Record<ButtonSize, string>> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Exported so a link can wear the same clothes without being wrapped in a button.
 *
 * `asChild`/Radix `Slot` would be the other way to do this, but it turns the anchor into
 * part of a client boundary for no benefit — an anchor is not a button, and the styles are
 * the only thing the two need to share.
 */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
}

export function Button({ variant = 'primary', size = 'md', className, type, ...props }: ButtonProps) {
  return (
    <button
      // A button inside a form defaults to `submit`, which is how a "Cancelar" quietly
      // submits. Explicit everywhere, overridable by the caller.
      type={type ?? 'button'}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
