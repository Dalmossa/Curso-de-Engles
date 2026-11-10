import type { LessonContent } from '@/core';
import { isPublishable } from '@/core';
import { Markdown } from './markdown';
import { CefrBadge } from './cefr-badge';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';

/**
 * The four authored phases of a lesson, in order.
 *
 * The ordering and the "exactly four" invariant were already enforced by `GetLesson`
 * (`normalizeLessonPhases`), so this component renders what it is given and does not
 * re-derive anything: if it had to defend against a three-phase lesson, the defensible place
 * to fail would have been the boundary, and there would now be two places deciding.
 *
 * `publication_state` is surfaced rather than hidden. A licence-restricted lesson is still
 * served — P1.18 consumes the field so a pre-publish check can act on it — and presenting it
 * as finished content would be exactly the mislabelling the repository's licence rules exist
 * to prevent.
 */
export function LessonView({ lesson }: { readonly lesson: LessonContent }) {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <CefrBadge level={lesson.cefrLevel} />
          <Badge tone="neutral" data-testid="authoring-state">
            {lesson.authoringState}
          </Badge>
          <Badge tone="neutral" data-testid="reuse-basis">
            {lesson.reuseBasis}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{lesson.title}</h1>
        <p className="font-mono text-xs text-ink-500">{lesson.lessonId}</p>

        {isPublishable(lesson) ? null : (
          <Alert tone="warning" title="Conteúdo ainda não liberado para publicação" data-testid="publication-warning">
            <p>
              Esta lição está marcada como <strong>{lesson.publicationState}</strong> no catálogo. O conteúdo é
              exibido para revisão, mas ainda não pode ser publicado.
            </p>
          </Alert>
        )}
      </header>

      <ol className="flex flex-col gap-8" data-testid="lesson-phases">
        {lesson.phases.map((phase) => (
          <li key={phase.phase} className="flex flex-col gap-3" data-testid={`lesson-phase-${phase.phase}`}>
            <div className="flex items-baseline gap-3 border-b border-border-subtle pb-2">
              <span className="text-xs font-semibold tabular-nums text-brand-600">
                FASE {phase.phase}
              </span>
              <h2 className="text-lg font-semibold text-ink-900">{phase.heading}</h2>
            </div>
            <Markdown>{phase.markdown}</Markdown>
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
