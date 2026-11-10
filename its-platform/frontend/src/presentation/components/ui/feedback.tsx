import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Loading and empty-state primitives — the two answers to the same question: "the data is
 * not on screen; what is?".
 *
 * Both carry the communication in a *container* and keep every decorative block
 * `aria-hidden`, because that is the difference between a screen reader saying one useful
 * sentence and it enumerating a dozen anonymous boxes. The loading region owns the message
 * (`role="status"` + sr-only text), the skeleton blocks own the pixels.
 */

/**
 * One decorative placeholder block.
 *
 * `bg-border-subtle` rather than `bg-surface-sunken`: the sunken tone *is* the page
 * background, so a skeleton painted with it disappears on the page and is barely there
 * inside a card. `motion-reduce:animate-none` keeps the pulse opt-out for users who asked
 * the operating system for less motion, and `max-w-full` keeps a wide bar (the mastery
 * header is `w-96`) from pushing a 320px viewport into horizontal scroll.
 */
export function Skeleton({ className }: { readonly className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'max-w-full animate-pulse rounded-md bg-border-subtle motion-reduce:animate-none',
        className,
      )}
    />
  );
}

export interface LoadingRegionProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * The whole of what assistive technology is told. Name the *screen that is coming*
   * ("Carregando o painel do aprendiz…"), not the mechanism: a sighted learner reads the
   * shape of the skeleton, and that shape is exactly what a screen reader cannot see.
   */
  readonly label: string;
}

/**
 * A region that is waiting for data.
 *
 * `aria-busy` is on the container rather than on the blocks, and `role="status"` is what
 * makes the sr-only sentence live — no explicit `aria-live` is set, because `status`
 * already implies `polite` and repeating it is the kind of noise a linter is right to flag.
 */
export function LoadingRegion({ label, className, children, ...props }: LoadingRegionProps) {
  return (
    <div role="status" aria-busy="true" className={cn('flex flex-col', className)} {...props}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  readonly title: string;
  readonly description: string;
  /** The way out. Omitting it is allowed, but an empty state with nothing to do is a dead end. */
  readonly action?: ReactNode;
}

/**
 * A panel with no data in it, plus the action that would produce some.
 *
 * The dashes and the centred block are deliberate: this has to be unmistakably *absence*
 * and not a card that failed to load, which is what the skeleton's shimmer means.
 */
export function EmptyState({ title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-strong p-8 text-center',
        className,
      )}
      {...props}
    >
      <p className="text-base font-semibold text-ink-900">{title}</p>
      <p className="max-w-prose text-sm text-ink-600">{description}</p>
      {action}
    </div>
  );
}
