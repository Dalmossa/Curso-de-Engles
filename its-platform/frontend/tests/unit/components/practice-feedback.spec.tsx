/**
 * `PracticeFeedbackPanel` — the one place in the product where the answer key is allowed
 * on screen.
 *
 * ADR-044 says the disclosure comes from `scored_items[].correct` and from nowhere else,
 * so the central test here is a swap: render the same `items` payload against two results
 * that differ only in `correct`, and require the verdicts to flip. A panel that had
 * quietly derived anything from the pack would keep saying the same thing.
 */
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PracticeFeedbackPanel } from '@/presentation/components/practice-feedback';
import {
  ALL_CORRECT_FEEDBACK,
  ALL_WRONG_FEEDBACK,
  EMPTY_FEEDBACK,
  GRAMMAR_ITEM,
  MIXED_FEEDBACK,
  PACK,
  PENDING_FEEDBACK,
  PRODUCTION_ITEM,
  VOCAB_ITEM,
} from './fixtures';

function renderPanel(feedback: typeof MIXED_FEEDBACK, items = PACK.items, onRestart = vi.fn()) {
  render(<PracticeFeedbackPanel feedback={feedback} items={items} onRestart={onRestart} />);
  return { onRestart };
}

function itemCard(itemId: string) {
  return within(screen.getByTestId(`feedback-item-${itemId}`));
}

describe('PracticeFeedbackPanel', () => {
  it('reports the graded counts and a verdict per item', () => {
    renderPanel(MIXED_FEEDBACK);

    const card = screen.getByTestId('practice-feedback');
    expect(card).toHaveTextContent(`Pacote ${PACK.packId}.`);
    expect(card).toHaveTextContent('2 itens corrigidos');
    expect(screen.getByText('Corretos: 1')).toBeInTheDocument();
    expect(screen.getByText('Errados: 1')).toBeInTheDocument();

    expect(itemCard(GRAMMAR_ITEM.itemId).getByText('Correto')).toBeInTheDocument();
    expect(itemCard(VOCAB_ITEM.itemId).getByText('Incorreto')).toBeInTheDocument();

    // The prompt is what identifies the item to the learner, so it must be on screen.
    expect(screen.getByText(GRAMMAR_ITEM.prompt)).toBeInTheDocument();
    expect(screen.getByText(VOCAB_ITEM.prompt)).toBeInTheDocument();
  });

  it('takes the verdict from scored_items[].correct, not from the item payload', () => {
    const { unmount } = render(
      <PracticeFeedbackPanel feedback={ALL_CORRECT_FEEDBACK} items={PACK.items} onRestart={vi.fn()} />,
    );
    expect(screen.getByText('Corretos: 1')).toBeInTheDocument();
    expect(itemCard(GRAMMAR_ITEM.itemId).getByText('Correto')).toBeInTheDocument();
    unmount();

    // Identical `items`, opposite result — the panel has nothing else to go on.
    renderPanel(ALL_WRONG_FEEDBACK, PACK.items);
    expect(screen.getByText('Errados: 1')).toBeInTheDocument();
    expect(itemCard(GRAMMAR_ITEM.itemId).getByText('Incorreto')).toBeInTheDocument();
    expect(screen.queryByText('Correto')).toBeNull();
  });

  it('marks an item with a null result as pending rather than wrong', () => {
    renderPanel(PENDING_FEEDBACK, [GRAMMAR_ITEM, PRODUCTION_ITEM]);

    expect(itemCard(PRODUCTION_ITEM.itemId).getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('Pendentes: 1')).toBeInTheDocument();
    expect(screen.getByTestId('practice-feedback')).toHaveTextContent('1 aguardando correção');
    expect(screen.getByText('Correção assíncrona')).toBeInTheDocument();
    // A pending item is excluded from the graded counts: it is neither right nor wrong yet.
    expect(screen.getByText('Corretos: 1')).toBeInTheDocument();
    expect(screen.getByText('Errados: 0')).toBeInTheDocument();
  });

  it('does not claim a grade for an item the result never mentioned', () => {
    renderPanel(ALL_CORRECT_FEEDBACK, PACK.items);

    expect(itemCard(VOCAB_ITEM.itemId).getByText('Sem pontuação')).toBeInTheDocument();
  });

  it('renders an empty result without inventing items or grades', () => {
    renderPanel(EMPTY_FEEDBACK, []);

    expect(screen.getByTestId('practice-feedback')).toHaveTextContent('0 itens corrigidos');
    expect(screen.getByText('Corretos: 0')).toBeInTheDocument();
    expect(screen.getByText('Detalhes por item')).toBeInTheDocument();
    expect(screen.queryByTestId(`feedback-item-${GRAMMAR_ITEM.itemId}`)).toBeNull();
    expect(screen.queryByText('Correção assíncrona')).toBeNull();
  });

  it('offers a restart and a way back to the dashboard', () => {
    const { onRestart } = renderPanel(MIXED_FEEDBACK);

    const back = screen.getByRole('link', { name: 'Voltar ao painel' });
    expect(back).toHaveAttribute('href', '/');

    fireEvent.click(screen.getByRole('button', { name: 'Refazer este pacote' }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
