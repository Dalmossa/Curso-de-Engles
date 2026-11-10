import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditional class names with Tailwind conflict resolution: `cn('p-2', 'p-4')`
 * yields `p-4` rather than both, which is what makes a `className` prop able to
 * override a component's own defaults.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
