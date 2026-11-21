import Link from 'next/link';
import type { LessonContent } from '@/core';
import { isPublishable } from '@/core';
import { routes } from '@/shared/routes';
import { CefrBadge } from './cefr-badge';
import { Alert } from './ui/alert';
import { LessonPhaseContent, type SynthesizeAction } from './lesson-phase-content';

export interface LessonViewHero {
  /** Optional unit label, e.g. "Unidade 1". Rendered only when provided. */
  readonly unitLabel?: string;
  /** Optional progress, e.g. 3/10. Rendered only when provided. */
  readonly progress?: { readonly current: number; readonly total: number };
  /** Optional hero illustration. Rendered only when provided. */
  readonly illustration?: { readonly src: string; readonly alt: string };
}

export interface LessonViewProps {
  readonly lesson: LessonContent;
  readonly synthesizeAction?: SynthesizeAction;
  /** Optional display-only metadata. Never fabricated; omitted fields are not rendered. */
  readonly hero?: LessonViewHero;
  /** Back navigation target. Defaults to home. */
  readonly backHref?: string;
}

/**
 * Lesson screen: header + optional hero illustration + 4 authored phases.
 *
 * The four-phase invariant is enforced by `GetLesson` (`normalizeLessonPhases`).
 * `publication_state` is surfaced rather than hidden: restricted content is served for
 * review, but must not look publishable.
 */
export function LessonView({
  lesson,
  synthesizeAction,
  hero,
  backHref = routes.home,
}: LessonViewProps) {
  const hasProgress = hero?.progress && hero.progress.total > 0;
  const hasUnit = Boolean(hero?.unitLabel);
  const hasHero = Boolean(hero?.illustration?.src);

  return (
    <article className="flex flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4">
        <div className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-2 sm:gap-3">
          <Link
            href={backHref}
            aria-label="Voltar"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <span aria-hidden="true" className="text-lg">←</span>
          </Link>

          <div className="min-w-0 text-center">
            {hasUnit ? (
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{hero?.unitLabel}</p>
            ) : null}
            <h1 className="truncate text-lg font-semibold tracking-tight text-ink-900 sm:text-2xl">{lesson.title}</h1>
          </div>

          <div className="flex min-w-11 items-center justify-end">
            {hasProgress ? (
              <p className="text-sm font-medium tabular-nums text-ink-600" aria-label={`Progresso ${hero!.progress!.current} de ${hero!.progress!.total}`}>
                {hero!.progress!.current}/{hero!.progress!.total}
              </p>
            ) : (
              <span className="h-11 w-11" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CefrBadge level={lesson.cefrLevel} />
        </div>

        {isPublishable(lesson) ? null : (
          <Alert tone="warning" title="Conteúdo ainda não liberado para publicação" data-testid="publication-warning">
            <p>
              Esta lição está marcada como <strong>{lesson.publicationState}</strong> no catálogo. O conteúdo é
              exibido para revisão, mas ainda não pode ser publicado.
            </p>
          </Alert>
        )}
      </header>

      {hasHero ? (
        <figure className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element -- hero src is optional runtime data; next/image requires configured domains */}
          <img
            src={hero!.illustration!.src}
            alt={hero!.illustration!.alt}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </figure>
      ) : null}

      <ol className="flex flex-col gap-8" data-testid="lesson-phases">
        {lesson.phases.map((phase) => (
          <li key={phase.phase} className="flex flex-col gap-3" data-testid={`lesson-phase-${phase.phase}`}>
            <div className="flex items-baseline gap-3 border-b border-border-subtle pb-2">
              <span className="text-xs font-semibold tabular-nums text-brand-600">
                FASE {phase.phase}
              </span>
              <h2 className="text-lg font-semibold text-ink-900">{phase.heading}</h2>
            </div>
            <LessonPhaseContent phase={phase} synthesizeAction={synthesizeAction} />
          </li>
        ))}
      </ol>

      <LearnerModelSection learnerModel={lesson.learnerModel} />
    </article>
  );
}

/**
 * The lesson's `DADOS PARA O LEARNER MODEL` block, when it has one.
 *
 * 1 of the 122 lessons declares none and the contract types the member as nullable, so the
 * absence is rendered as "not declared" rather than as an empty panel. Shown as JSON because
 * no screen consumes it yet — presenting it as if it had been interpreted would be a claim
 * nobody has made.
 */
function LearnerModelSection({ learnerModel }: { readonly learnerModel: LessonContent['learnerModel'] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-ink-900">Dados para o learner model</h2>
      {learnerModel === null ? (
        <p className="text-sm text-ink-600" data-testid="learner-model-absent">
          Esta lição não declara um bloco de dados para o learner model.
        </p>
      ) : (
        <pre
          className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-sunken p-4 text-xs text-ink-800"
          data-testid="learner-model"
        >
          {JSON.stringify(learnerModel, null, 2)}
        </pre>
      )}
    </section>
  );
}
