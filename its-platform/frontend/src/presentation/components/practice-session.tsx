'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  isChoiceAnswerable,
  toSubmissionResponses,
  unansweredItemIds,
  type AssessmentItem,
  type PackContent,
  type PracticeAnswerDraft,
  type PracticeResponseInput,
} from '@/core';
import type { PracticeFeedback } from '@/application/use-cases/submit-practice';
import { deserializeDomainError, type ActionResult } from '@/shared/action-result';
import { routes } from '@/shared/routes';
import { cn } from '@/shared/utils/cn';
import { ErrorState } from './error-state';
import { PracticeFeedbackPanel } from './practice-feedback';
import { Badge } from './ui/badge';
import { buttonClasses, Button } from './ui/button';
import { EmptyState } from './ui/feedback';
import { EMPTY_STATE_COPY, skillLabel } from '../lib/copy';

export interface PracticeSessionProps {
  readonly pack: PackContent;
  /**
   * Injected rather than imported: the Server Action lives in `src/app`, which is the
   * composition zone. A client component importing from there would invert the layering and
   * drag the server container's module graph into the browser bundle.
   */
  readonly onSubmit: (
    _packId: string,
    _responses: readonly PracticeResponseInput[],
  ) => Promise<ActionResult<PracticeFeedback>>;
}

/**
 * The practice session.
 *
 * This is the only surface where the answer key exists in the browser — and only *after* a
 * submission, because `scored_items[].correct` is the sole place the platform discloses it
 * (ADR-044 keeps the key unmarked in the pack payload). Before submitting, every option is
 * rendered exactly as received: nothing sorted, nothing highlighted, no "correct" class
 * derived from the data, because the data does not contain the answer.
 */
export function PracticeSession({ pack, onSubmit }: PracticeSessionProps) {
  const [drafts, setDrafts] = useState<Record<string, PracticeAnswerDraft>>({});
  const [touched, setTouched] = useState(false);
  const startedAt = useRef<Record<string, number>>({});

  const missing = useMemo(() => unansweredItemIds(pack.items, drafts), [pack.items, drafts]);

  const mutation = useMutation({
    mutationFn: async (responses: readonly PracticeResponseInput[]) => {
      const result = await onSubmit(pack.packId, responses);
      if (!result.ok) throw deserializeDomainError(result.error);
      return result.data;
    },
  });

  const markStarted = useCallback((itemId: string) => {
    startedAt.current[itemId] ??= Date.now();
  }, []);

  const update = useCallback((itemId: string, patch: Partial<PracticeAnswerDraft>) => {
    setDrafts((current) => {
      const existing = current[itemId] ?? {
        itemId,
        selectedLetter: null,
        transcript: null,
        responseTimeMs: 0,
      };
      return { ...current, [itemId]: { ...existing, ...patch } };
    });
  }, []);

  const submit = () => {
    setTouched(true);
    if (missing.length > 0) return;

    const now = Date.now();
    const withTimings: Record<string, PracticeAnswerDraft> = {};
    for (const item of pack.items) {
      const draft = drafts[item.itemId];
      if (!draft) continue;
      const began = startedAt.current[item.itemId];
      withTimings[item.itemId] = {
        ...draft,
        // Time from first interaction to submission, which is the only span the UI actually
        // observes. An item the learner read and answered at once reports a few seconds —
        // honest, if a floor rather than a measurement.
        responseTimeMs: began === undefined ? 0 : now - began,
      };
    }

    mutation.mutate(toSubmissionResponses(pack.items, withTimings));
  };

  // An empty pack is a state the contract allows (`items` is a list) and one the form cannot
  // express: it would render "0 itens neste pacote" and a submit button whose payload is an
  // empty response list. Neither is an answer, so the learner is sent back to the lesson that
  // owns the pack. Checked before the success branch because nothing can have been submitted.
  if (pack.items.length === 0) {
    const copy = EMPTY_STATE_COPY.practicePack;
    return (
      <EmptyState
        title={copy.title}
        description={copy.description}
        action={
          <Link
            href={routes.lesson(pack.lessonId)}
            className={buttonClasses('primary', 'md')}
            data-testid="empty-pack-cta"
          >
            {copy.actionLabel}
          </Link>
        }
        data-testid="empty-pack"
      />
    );
  }

  if (mutation.isSuccess) {
    return (
      <PracticeFeedbackPanel
        feedback={mutation.data}
        items={pack.items}
        onRestart={() => {
          mutation.reset();
          setDrafts({});
          startedAt.current = {};
          setTouched(false);
        }}
      />
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      /*
       * The form's *native* destination, which only matters in the window before React
       * hydrates. Until the `onSubmit` below is attached, the only thing between a click and
       * the browser is the markup itself, and a native submission is a GET that **replaces**
       * the URL's query string with the form data set — an `action` carrying `?pack=…` is
       * dropped, not merged (verified in Chromium: `action=""` on a page at
       * `…/practice?pack=x` lands on `…/practice?`). `?` alone is `pack === undefined` to
       * `page.tsx`, which redirects to the lesson: the learner loses the screen they were
       * on, and their answers with it.
       *
       * So the pack travels as a form *field* (`practice-pack-field` below) as well as in the
       * action. That makes the pre-hydration click a no-op navigation back to the same
       * practice URL instead of a silent trip to the lesson — including when the bundles
       * never arrive at all, where no handler will ever run to warn anyone.
       */
      method="get"
      action={routes.lessonPractice(pack.lessonId, pack.packId)}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      aria-busy={mutation.isPending}
    >
      {/*
        The field that keeps `?pack=…` alive through a native submission. Without it the
        native target loses its query exactly as above; with it, the browser rebuilds the
        query the screen was rendered for. Named `pack` because that is the parameter
        `page.tsx` reads, and hidden because the answer is never carried this way — the
        post-hydration submission is the React one, untouched.
      */}
      <input type="hidden" name="pack" value={pack.packId} data-testid="practice-pack-field" />

      <p className="text-sm text-ink-600">
        {pack.items.length} {pack.items.length === 1 ? 'item' : 'itens'} neste pacote. Responda todos para
        enviar.
      </p>

      {mutation.isError ? <ErrorState error={mutation.error} /> : null}

      <ol className="flex flex-col gap-6">
        {pack.items.map((item, index) => (
          <li key={item.itemId}>
            <PracticeQuestion
              item={item}
              index={index}
              draft={drafts[item.itemId]}
              disabled={mutation.isPending}
              onStart={() => markStarted(item.itemId)}
              onChange={(patch) => update(item.itemId, patch)}
            />
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 border-t border-border-subtle pt-5">
        {touched && missing.length > 0 ? (
          <p role="status" className="text-sm text-warning-700" data-testid="unanswered-warning">
            Faltam {missing.length} {missing.length === 1 ? 'item' : 'itens'} sem resposta.
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" disabled={mutation.isPending || (touched && missing.length > 0)}>
            {mutation.isPending ? 'Enviando…' : 'Enviar respostas'}
          </Button>
          {mutation.isPending ? (
            <span className="text-sm text-ink-600" role="status">
              Enviando respostas…
            </span>
          ) : null}
        </div>
      </div>
    </form>
  );
}

interface PracticeQuestionProps {
  readonly item: AssessmentItem;
  readonly index: number;
  readonly draft: PracticeAnswerDraft | undefined;
  readonly disabled: boolean;
  readonly onStart: () => void;
  readonly onChange: (patch: Partial<PracticeAnswerDraft>) => void;
}

function PracticeQuestion({ item, index, draft, disabled, onStart, onChange }: PracticeQuestionProps) {
  const choice = isChoiceAnswerable(item);

  return (
    <fieldset
      className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-raised p-5"
      data-testid={`practice-item-${item.itemId}`}
      data-item-id={item.itemId}
    >
      <legend className="sr-only">
        Item {index + 1}: {item.prompt}
      </legend>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold tabular-nums text-ink-500">{index + 1}.</span>
        <Badge tone="neutral">{skillLabel(item.skill)}</Badge>
        <Badge tone="neutral">{item.itemType}</Badge>
        {/* `scoring` is rendered because it is what explains an item with no options:
            `asr_phoneme_match` items carry `options: []` by design. */}
        <Badge tone="neutral">{item.scoring}</Badge>
      </div>

      <p className="text-base font-medium text-ink-900">{item.prompt}</p>

      {choice ? (
        <div className="flex flex-col gap-2">
          {item.options.map((option) => {
            const id = `${item.itemId}-${option.letter}`;
            const selected = draft?.selectedLetter === option.letter;
            return (
              <label
                key={option.letter}
                htmlFor={id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors',
                  selected
                    ? 'border-brand-400 bg-brand-50 text-ink-900'
                    : 'border-border-subtle hover:bg-surface-sunken',
                  disabled && 'cursor-not-allowed opacity-70',
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name={`item-${item.itemId}`}
                  value={option.letter}
                  checked={selected}
                  disabled={disabled}
                  onFocus={onStart}
                  onChange={() => {
                    onStart();
                    onChange({ selectedLetter: option.letter });
                  }}
                  className="mt-0.5 size-4 shrink-0 accent-brand-600"
                />
                <span className="flex flex-col gap-0.5">
                  <span>
                    <span className="font-semibold">{option.letter}.</span> {option.text}
                  </span>
                  {/* Safe to render: `br_pt_form` is published only when *every* option of
                      the item carries one, so its presence never singles out the key. */}
                  {option.brPtForm === null ? null : (
                    <span className="text-xs text-ink-500">{option.brPtForm}</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor={`${item.itemId}-transcript`} className="text-sm text-ink-700">
            {item.scoring === 'asr_phoneme_match'
              ? 'Transcrição da sua resposta falada'
              : 'Sua resposta'}
          </label>
          <textarea
            id={`${item.itemId}-transcript`}
            rows={2}
            disabled={disabled}
            value={draft?.transcript ?? ''}
            onFocus={onStart}
            onChange={(event) => {
              onStart();
              onChange({ transcript: event.target.value });
            }}
            // The phoneme-scoring note below is an instruction for *this* field, so it is
            // associated with it rather than merely printed after it (WCAG 1.3.1 / 3.3.2).
            aria-describedby={item.scoring === 'asr_phoneme_match' ? `${item.itemId}-scoring-hint` : undefined}
            className="w-full resize-y rounded-lg border border-border-subtle bg-surface-raised p-3 text-sm text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {item.scoring === 'asr_phoneme_match' ? (
            <p id={`${item.itemId}-scoring-hint`} className="text-xs text-ink-500">
              A captura de áudio para pontuação por fonema ainda não está nesta versão — por enquanto, escreva o
              que você diria.
            </p>
          ) : null}
        </div>
      )}
    </fieldset>
  );
}
