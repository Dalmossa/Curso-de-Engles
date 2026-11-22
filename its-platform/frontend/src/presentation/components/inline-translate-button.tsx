'use client';

import { useCallback, useId, useState } from 'react';
import { cn } from '@/shared/utils/cn';

export interface InlineTranslateButtonProps {
  readonly textEn: string;
  readonly translationPt?: string | null;
  readonly onToggle?: (isOpen: boolean) => void;
  readonly isOpen?: boolean;
  readonly className?: string;
  readonly label?: string;
  readonly hideLabel?: string;
  /** When true, renders only the button (translation panel rendered by parent). */
  readonly buttonOnly?: boolean;
  /** ID of the controlled panel for aria-controls. */
  readonly controlsId?: string;
}

export function InlineTranslateButton({
  textEn,
  translationPt,
  onToggle,
  isOpen: controlledIsOpen,
  className,
  label = 'PT',
  hideLabel = 'Ocultar tradução',
  buttonOnly = false,
  controlsId,
}: InlineTranslateButtonProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const controlled = controlledIsOpen !== undefined;
  const isOpen = controlled ? controlledIsOpen : uncontrolledOpen;
  const generatedPanelId = useId();
  const panelId = controlsId ?? generatedPanelId;
  const hasTranslation = typeof translationPt === 'string' && translationPt.trim().length > 0;

  const toggle = useCallback(() => {
    if (!hasTranslation) return;
    const next = !isOpen;
    if (!controlled) setUncontrolledOpen(next);
    onToggle?.(next);
  }, [controlled, hasTranslation, isOpen, onToggle]);

  if (!hasTranslation) return null;

  const button = (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={panelId}
      aria-label={isOpen ? `${hideLabel}: ${textEn}` : `Traduzir para português: ${textEn}`}
      title={isOpen ? hideLabel : 'Ver tradução em português'}
      data-testid="inline-translate-button"
      data-open={isOpen ? 'true' : 'false'}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-2 text-[11px] font-semibold tracking-wide transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isOpen
          ? 'border-teal-300 bg-teal-100 text-teal-800 shadow-sm'
          : 'border-border-subtle bg-surface-raised text-ink-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800',
        className,
      )}
    >
      <span aria-hidden="true">{isOpen ? 'PT' : label}</span>
    </button>
  );

  if (buttonOnly) return button;

  return (
    <span className="inline-flex flex-col items-start gap-1">
      {button}
      <span
        id={panelId}
        role="region"
        aria-label="Tradução em português"
        aria-hidden={!isOpen}
        data-testid="inline-translate-panel"
        className={cn(
          'grid w-full transition-all duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <span className="overflow-hidden">
          <span className="mt-0.5 block rounded-md border border-teal-100 bg-teal-50/80 px-2.5 py-1.5 text-sm leading-relaxed text-ink-800">
            <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700">PT-BR</span>
            {translationPt}
          </span>
        </span>
      </span>
    </span>
  );
}
