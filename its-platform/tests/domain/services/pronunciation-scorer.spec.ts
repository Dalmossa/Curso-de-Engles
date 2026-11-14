/**
 * História 2 — o scorer de pronúncia, isolado de HTTP, de áudio e de fornecedor.
 *
 * O que estes testes protegem não é o formato da resposta (o contrato cobre isso), e sim as
 * três decisões que fazem a nota ser útil ao aprendiz:
 *
 *  1. **Normalização antes da comparação** — caixa e pontuação não são fala.
 *  2. **Alinhamento antes da similaridade** — uma palavra a mais no meio não pode deslocar todas
 *     as seguintes e marcar como erradas palavras ditas corretamente.
 *  3. **`missed` ≠ `needs_work`** — ausência e desvio pedem ações diferentes.
 *
 * Os limiares aparecem nos testes como casos concretos ("esta palavra é `needs_work`"), nunca como
 * a constante reimportada: um teste que recompõe a fórmula do código não detecta quando a fórmula
 * muda.
 */
import {
  scorePronunciation,
  tokenizeForScoring,
  wordSimilarity,
} from '../../../src/domain/services/pronunciation-scorer.js';

describe('tokenizeForScoring', () => {
  it('lowercases and strips punctuation, keeping the words in order', () => {
    expect(tokenizeForScoring('Hello, world! How are you?')).toEqual([
      'hello',
      'world',
      'how',
      'are',
      'you',
    ]);
  });

  it('keeps the internal apostrophe and drops the quoting ones', () => {
    expect(tokenizeForScoring("I don't think 'this' works.")).toEqual([
      'i',
      "don't",
      'think',
      'this',
      'works',
    ]);
  });

  it('keeps accented letters instead of splitting the word', () => {
    expect(tokenizeForScoring('café résumé')).toEqual(['café', 'résumé']);
  });

  it('returns nothing for a string with no letters', () => {
    // Digits are not spoken by the target phrase: they are read as words the transcript carries
    // ("three"), so a bare number is not a comparable token.
    expect(tokenizeForScoring('  !?… — 123 ')).toEqual([]);
    expect(tokenizeForScoring('')).toEqual([]);
  });
});

describe('wordSimilarity', () => {
  it('is 1 for identical words and 0 for two words sharing nothing', () => {
    expect(wordSimilarity('read', 'read')).toBe(1);
    // Levenshtein('abc','xyz') = 3, longest = 3 → 0.
    expect(wordSimilarity('abc', 'xyz')).toBe(0);
  });

  it('rewards a one-character deviation in a long word', () => {
    // 'though' vs 'thought': 2 edits over 7 characters → ~0.714, above the needs_work floor.
    const similarity = wordSimilarity('though', 'thought');
    expect(similarity).toBeGreaterThan(0.7);
    expect(similarity).toBeLessThan(1);
  });
});

describe('scorePronunciation', () => {
  it('scores a perfect reading 100 with every word correct', () => {
    const result = scorePronunciation('I work as a developer', 'I work as a developer');

    expect(result.overall_score).toBe(100);
    expect(result.word_scores).toHaveLength(5);
    expect(result.word_scores.every(word => word.status === 'correct')).toBe(true);
    expect(result.word_scores.every(word => word.confidence === 1)).toBe(true);
  });

  it('ignores case and punctuation on both sides', () => {
    const result = scorePronunciation('Good morning, team!', 'good MORNING team');

    expect(result.overall_score).toBe(100);
    expect(result.word_scores.map(word => word.word)).toEqual(['good', 'morning', 'team']);
  });

  it('marks a near-miss as needs_work and scores it partially', () => {
    // 'review' → 'reviu': 2 edits over 6 characters → ~0.667, inside the partial band.
    const result = scorePronunciation('review the code', 'reviu the code');
    const review = result.word_scores.find(word => word.word === 'review');

    expect(review?.status).toBe('needs_work');
    expect(review?.confidence).toBeGreaterThanOrEqual(0.5);
    expect(review?.confidence).toBeLessThan(0.9);
    expect(result.overall_score).toBeGreaterThan(50);
    expect(result.overall_score).toBeLessThan(100);
  });

  it('marks a word that was never recognised as missed with confidence 0', () => {
    const result = scorePronunciation('deploy the service', 'deploy the');
    const service = result.word_scores.find(word => word.word === 'service');

    expect(service?.status).toBe('missed');
    expect(service?.confidence).toBe(0);
  });

  it('does not shift the words after an inserted one', () => {
    // Without alignment, 'really' would push 'need' onto 'to', 'this' onto 'need', … and the
    // whole tail would read as missed. The target words must all still be correct.
    const result = scorePronunciation('I need this now', 'I really need this now');

    expect(result.overall_score).toBe(100);
    expect(result.word_scores.every(word => word.status === 'correct')).toBe(true);
  });

  it('does not reward a dropped word by shifting the rest', () => {
    const result = scorePronunciation('I need this now', 'I need now');
    const thisWord = result.word_scores.find(word => word.word === 'this');

    expect(thisWord?.status).toBe('missed');
    expect(result.overall_score).toBe(75);
  });

  it('scores 0 when nothing expected was heard', () => {
    const result = scorePronunciation('deploy the service', '');
    expect(result.overall_score).toBe(0);
    expect(result.word_scores.every(word => word.status === 'missed')).toBe(true);
    expect(result.feedback_pt).toContain('microfone');
  });

  it('scores 0 with no word_scores when there is no target text', () => {
    const result = scorePronunciation('   ', 'anything at all');
    expect(result.overall_score).toBe(0);
    expect(result.word_scores).toEqual([]);
    expect(result.feedback_pt).toContain('texto-alvo');
  });

  it('never divides by zero and always rounds overall_score to an integer', () => {
    const result = scorePronunciation('a bb ccc', 'a bx ccc');
    expect(Number.isInteger(result.overall_score)).toBe(true);
    expect(result.overall_score).toBeGreaterThanOrEqual(0);
    expect(result.overall_score).toBeLessThanOrEqual(100);
  });

  it('names the word to fix in the pt-BR feedback when the score is below full', () => {
    const result = scorePronunciation('deploy the service', 'deploy the');
    expect(result.feedback_pt).toMatch(/service/);
    expect(result.feedback_pt.length).toBeGreaterThan(0);
  });

  it('encourages a fluent repeat when the score is above 95', () => {
    const result = scorePronunciation('open the pull request', 'open the pull request');
    expect(result.feedback_pt).toContain('Repita');
  });

  it('keeps the word order of the target, not of the transcript', () => {
    const result = scorePronunciation('alpha beta gamma', 'alpha gamma beta');
    expect(result.word_scores.map(word => word.word)).toEqual(['alpha', 'beta', 'gamma']);
  });
});
