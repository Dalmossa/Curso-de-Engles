/**
 * `PracticeSession` — the only surface where the answer key exists in the browser, and
 * only after a submission (ADR-044).
 *
 * The tests are written the way the component is used: type into the fields a learner
 * touches, press the button a learner presses, and read back what a learner sees. The
 * claims that matter most are negative ones — before the submission there is no marked
 * option, no answer, and no count of right answers anywhere in the document — so they are
 * asserted against the rendered DOM rather than against internal state.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PracticeResponseInput } from '@/core';
import { optionsRevealKey } from '@/core';
import { PracticeSession, type PracticeSessionProps } from '@/presentation/components/practice-session';
import type { ActionResult } from '@/shared/action-result';
import type { PracticeFeedback } from '@/application/use-cases/submit-practice';
import {
  GRAMMAR_ITEM,
  MIXED_FEEDBACK,
  PACK,
  PACK_WITH_PRODUCTION,
  PRONUNCIATION_ITEM,
  PRODUCTION_ITEM,
  VOCAB_ITEM,
} from './fixtures';

type SubmitFn = PracticeSessionProps['onSubmit'];

function ok(data: PracticeFeedback): ActionResult<PracticeFeedback> {
  return { ok: true, data };
}

/** A `Server Action` failure, as it reaches the client: data, never a thrown error. */
const FAILED: ActionResult<PracticeFeedback> = {
  ok: false,
  error: {
    kind: 'server',
    status: 503,
    title: 'Service Unavailable',
    detail: 'The practice service is unavailable.',
    problemType: 'https://its.local/problems/unavailable',
    requestId: 'req-42',
    retryAfterSeconds: null,
  },
};

/**
 * A fresh `QueryClient` per render: a shared one would carry a finished mutation into the
 * next test and make the component's success state leak between cases.
 */
function renderSession(options: { pack?: typeof PACK; onSubmit?: SubmitFn } = {}) {
  const onSubmit: SubmitFn = options.onSubmit ?? vi.fn<SubmitFn>(async () => ok(MIXED_FEEDBACK));
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });

  const view = render(
    <QueryClientProvider client={queryClient}>
      <PracticeSession pack={options.pack ?? PACK} onSubmit={onSubmit} />
    </QueryClientProvider>,
  );

  // Handed back as a mock so the specs can read `.mock.calls` — the wrapper itself is still
  // typed as `SubmitFn`, which is what the component is allowed to depend on.
  return { ...view, onSubmit: vi.mocked(onSubmit) };
}

/** Fills in every choice item of `PACK`, picking the option a learner happens to click. */
function answerBothItems() {
  fireEvent.click(screen.getByRole('radio', { name: /I agree with you/ }));
  fireEvent.click(screen.getByRole('radio', { name: /a bug/ }));
}

/** Option texts contain `.` and `?`, so a plain interpolation would not be literal. */
function literal(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function submitButton() {
  return screen.getByRole('button', { name: 'Enviar respostas' });
}

/** `mutate()` schedules the mutation; the assertion has to wait for the scheduler. */
async function expectSubmit(onSubmit: SubmitFn, times = 1) {
  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(times));
}

describe('PracticeSession', () => {
  it('renders every item with its options exactly as the payload declares them', () => {
    renderSession();

    for (const item of PACK.items) {
      const card = screen.getByTestId(`practice-item-${item.itemId}`);
      expect(within(card).getByText(item.prompt)).toBeInTheDocument();
      expect(card).toHaveAttribute('data-item-id', item.itemId);

      for (const option of item.options) {
        const radio = within(card).getByRole('radio', {
          name: new RegExp(`^${literal(option.letter)}\\.`),
        });
        expect(radio).toHaveAccessibleName(new RegExp(literal(option.text)));
        if (option.brPtForm !== null) {
          expect(within(card).getByText(option.brPtForm)).toBeInTheDocument();
        }
      }
    }

    // Two choice items, three options each: nothing dropped, nothing duplicated.
    expect(screen.getAllByRole('radio')).toHaveLength(6);
  });

  it('does not disclose the answer key before the submission (ADR-044)', () => {
    const { onSubmit } = renderSession();

    // The fixture itself is a legal pack payload: no `is_key`, no `note`, no `correct`.
    expect(PACK.items.some((item) => optionsRevealKey(item.options))).toBe(false);
    expect(JSON.stringify(PACK)).not.toContain('"correct"');

    // Nothing is pre-selected, so "the first option" cannot act as an answer.
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.some((radio) => radio.checked)).toBe(false);

    // No part of the interface has been told which one is right.
    expect(screen.queryByText(/correto|incorreto|resposta correta/i)).toBeNull();
    expect(screen.queryByTestId('practice-feedback')).toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('refuses to submit while an item is unanswered, and says how many are missing', () => {
    const { onSubmit } = renderSession();

    fireEvent.click(screen.getByRole('radio', { name: /I agree with you/ }));
    fireEvent.click(submitButton());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('unanswered-warning')).toHaveTextContent('Faltam 1 item sem resposta.');
    expect(submitButton()).toBeDisabled();
  });

  it('warns about every unanswered item when the pack is untouched', () => {
    renderSession();

    fireEvent.click(submitButton());

    expect(screen.getByTestId('unanswered-warning')).toHaveTextContent('Faltam 2 itens sem resposta.');
  });

  it('submits the letters the learner chose and reveals the feedback afterwards', async () => {
    const { onSubmit } = renderSession();

    answerBothItems();
    fireEvent.click(submitButton());

    await expectSubmit(onSubmit);
    const call = onSubmit.mock.calls[0];
    expect(call?.[0]).toBe(PACK.packId);
    // The response carries the chosen letter and a timing — never a correctness claim.
    expect(call?.[1]).toEqual([
      { itemId: GRAMMAR_ITEM.itemId, response: 'B', responseTimeMs: expect.any(Number) },
      { itemId: VOCAB_ITEM.itemId, response: 'A', responseTimeMs: expect.any(Number) },
    ]);

    expect(await screen.findByTestId('practice-feedback')).toBeInTheDocument();
    expect(screen.getByText('Corretos: 1')).toBeInTheDocument();
    expect(screen.getByText('Errados: 1')).toBeInTheDocument();

    // The form is replaced, not merely covered: the key cannot be read off the old one.
    expect(screen.queryByTestId(`practice-item-${GRAMMAR_ITEM.itemId}`)).toBeNull();
    expect(screen.queryByRole('radio')).toBeNull();
  });

  it('submits a production item as a transcript', async () => {
    const { onSubmit } = renderSession({
      pack: PACK_WITH_PRODUCTION,
      onSubmit: vi.fn<SubmitFn>(async () => ok(MIXED_FEEDBACK)),
    });

    expect(screen.getByTestId(`practice-item-${PRONUNCIATION_ITEM.itemId}`)).toHaveTextContent(
      'Transcrição da sua resposta falada',
    );
    expect(screen.getByTestId(`practice-item-${PRONUNCIATION_ITEM.itemId}`)).toHaveTextContent(
      'A captura de áudio para pontuação por fonema ainda não está nesta versão',
    );

    fireEvent.change(screen.getByLabelText('Sua resposta'), {
      target: { value: '  I wake up at seven.  ' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /I agree with you/ }));
    fireEvent.click(submitButton());

    // A blank transcript is not an answer: the item with `options: []` still blocks.
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('unanswered-warning')).toHaveTextContent('Faltam 1 item sem resposta.');

    fireEvent.change(screen.getByLabelText('Transcrição da sua resposta falada'), {
      target: { value: 'think' },
    });
    fireEvent.click(submitButton());

    await expectSubmit(onSubmit);
    const responses = onSubmit.mock.calls[0]?.[1] as readonly PracticeResponseInput[];
    // In pack order, trimmed, and each one the shape its own scoring mode requires.
    expect(responses).toEqual([
      {
        itemId: PRODUCTION_ITEM.itemId,
        response: { transcript: 'I wake up at seven.' },
        responseTimeMs: expect.any(Number),
      },
      {
        itemId: PRONUNCIATION_ITEM.itemId,
        response: { transcript: 'think' },
        responseTimeMs: expect.any(Number),
      },
      { itemId: GRAMMAR_ITEM.itemId, response: 'B', responseTimeMs: expect.any(Number) },
    ]);
  });

  it('shows the error state when the submission fails, and keeps the answers', async () => {
    const { onSubmit } = renderSession({ onSubmit: vi.fn<SubmitFn>(async () => FAILED) });

    answerBothItems();
    fireEvent.click(submitButton());

    const errorState = await screen.findByTestId('error-state');
    expect(errorState).toHaveAttribute('data-error-kind', 'server');
    expect(screen.getByText('A plataforma falhou ao responder')).toBeInTheDocument();
    expect(screen.getByText('Código da requisição: req-42')).toBeInTheDocument();

    // A failure is not a result: no feedback, no key, and the answers are still there.
    expect(screen.queryByTestId('practice-feedback')).toBeNull();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('radio', { name: /I agree with you/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /a bug/ })).toBeChecked();
  });

  it('disables the inputs while the submission is in flight', async () => {
    let resolveSubmit: (result: ActionResult<PracticeFeedback>) => void = () => {};
    const pending = new Promise<ActionResult<PracticeFeedback>>((resolve) => {
      resolveSubmit = resolve;
    });
    renderSession({ onSubmit: vi.fn<SubmitFn>(() => pending) });

    answerBothItems();
    fireEvent.click(submitButton());

    expect(await screen.findByText('Enviando respostas…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }

    await act(async () => {
      resolveSubmit(ok(MIXED_FEEDBACK));
    });
    expect(await screen.findByTestId('practice-feedback')).toBeInTheDocument();
  });

  it('starts over with every answer cleared when the learner asks to redo the pack', async () => {
    const { onSubmit } = renderSession();

    answerBothItems();
    fireEvent.click(submitButton());
    await screen.findByTestId('practice-feedback');

    fireEvent.click(screen.getByRole('button', { name: 'Refazer este pacote' }));

    expect(screen.queryByTestId('practice-feedback')).toBeNull();
    expect(submitButton()).toBeEnabled();
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.some((radio) => radio.checked)).toBe(false);
    // No answer survived the reset, so a second attempt cannot be submitted by accident.
    fireEvent.click(submitButton());
    expect(screen.getByTestId('unanswered-warning')).toHaveTextContent('Faltam 2 itens sem resposta.');
    await act(async () => {});
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
