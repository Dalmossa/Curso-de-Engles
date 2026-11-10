import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cn('rounded-xl border border-border-subtle bg-surface-raised shadow-sm', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'header'>) {
  return <header className={cn('flex flex-col gap-1 border-b border-border-subtle p-5', className)} {...props} />;
}

export function CardBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'footer'>) {
  return (
    <footer
      className={cn('flex flex-wrap items-center gap-3 border-t border-border-subtle p-5', className)}
      {...props}
    />
  );
}

export interface CardTitleProps extends ComponentPropsWithoutRef<'h2'> {
  /** Heading level, so the document outline follows the page rather than the visual size. */
  readonly as?: ElementType;
  readonly children: ReactNode;
}

export function CardTitle({ as: Heading = 'h2', className, ...props }: CardTitleProps) {
  return <Heading className={cn('text-base font-semibold text-ink-900', className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-sm text-ink-600', className)} {...props} />;
}
