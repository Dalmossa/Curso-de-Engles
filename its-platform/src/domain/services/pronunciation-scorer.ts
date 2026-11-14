/**
 * Pronúncia avaliada por alinhamento palavra a palavra — a parte determinística da História 2.
 *
 * O reconhecimento de fala (ASR) entrega uma **transcrição**; decidir o que isso significa para
 * o aprendiz é domínio, não infraestrutura. Por isso este módulo é puro: sem `@nestjs`, sem
 * `fetch`, sem relógio. A mesma função roda no teste unitário e no endpoint.
 *
 * As três decisões que o arquivo toma, e por quê:
 *
 * 1. **Comparação normalizada, nunca literal.** `Read` e `read:`, `Don't` e `dont` são a mesma
 *    palavra falada. Tokenizar por letras (Unicode) e minúsculas remove pontuação e caixa, que
 *    são convenções da escrita — o aprendiz não as pronuncia.
 * 2. **Alinhamento por maior subsequência comum, e só depois similaridade.** Sem o alinhamento,
 *    uma palavra inserida no meio ("I *really* think so") deslocaria todas as seguintes e
 *    marcaria como erradas palavras que foram ditas corretamente. A LCS fixa as âncoras exatas;
 *    a similaridade (distância de Levenshtein normalizada) resolve o que sobrou — a palavra
 *    parcialmente reconhecida, que é o caso em que o feedback é útil.
 * 3. **`missed` é ausência, não erro de articulação.** Uma palavra não dita e uma palavra dita
 *    errado pedem ações diferentes do aprendiz, e a UI pinta as duas de cores diferentes. Por
 *    isso o status é um enum de três valores, e não um booleano.
 *
 * Nenhum limiar aqui é arbitrário por gosto: `0.9` é a distância em que uma palavra reconhecida
 * difere por uma letra em dez, e `0.5` é o ponto em que metade dos caracteres coincide — abaixo
 * disso o ASR normalmente devolveu outra palavra, não a mesma mal pronunciada.
 */

export type PronunciationWordStatus = 'correct' | 'needs_work' | 'missed';

export interface PronunciationWordScore {
  /** A palavra-alvo, como o aprendiz a leu — a mensagem é sobre *esta* palavra. */
  readonly word: string;
  readonly status: PronunciationWordStatus;
  /** Similaridade observada, 0–1, arredondada a duas casas. `1` só para acerto exato. */
  readonly confidence: number;
}

export interface PronunciationEvaluationResult {
  /** 0–100, média das palavras-alvo. Não é percentual de acertos: `needs_work` pontua parcial. */
  readonly overall_score: number;
  readonly word_scores: readonly PronunciationWordScore[];
  /** Uma frase em pt-BR, sem jargão fonético, apontando o próximo passo. */
  readonly feedback_pt: string;
}

/** Acima disto a palavra foi reconhecida como a esperada. */
const CORRECT_THRESHOLD = 0.9;

/** Entre os dois limiares a palavra foi reconhecida, mas com desvio. */
const NEEDS_WORK_THRESHOLD = 0.5;

/** Letras Unicode (com marcas) e apóstrofo: o que sobra depois de tirar pontuação e espaço. */
const WORD_PATTERN = /[\p{L}\p{M}']+/gu;

/**
 * As palavras que o avaliador compara, na ordem em que aparecem.
 *
 * Apóstrofos nas pontas caem (`'hello'` → `hello`) porque são citação, não fala; o apóstrofo
 * interno fica, porque `don't` e `dont` são a mesma palavra e `dont` não é outra.
 */
export function tokenizeForScoring(text: string): readonly string[] {
  const matches = text.toLowerCase().match(WORD_PATTERN) ?? [];
  return matches.map(token => token.replace(/^'+|'+$/g, '')).filter(token => token.length > 0);
}

/** Distância de edição (Levenshtein) entre duas palavras já normalizadas. */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = new Array<number>(b.length + 1).fill(0);
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const substitution = (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1);
      const deletion = (previous[j] ?? 0) + 1;
      const insertion = (current[j - 1] ?? 0) + 1;
      current[j] = Math.min(substitution, deletion, insertion);
    }
    previous = current;
  }
  return previous[b.length] ?? 0;
}

/** Similaridade 0–1: `1` para igualdade, `0` para duas palavras sem nenhum caractere em comum. */
export function wordSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return 1 - editDistance(a, b) / longest;
}

/**
 * Os pares (índice esperado, índice falado) da maior subsequência comum **exata**.
 *
 * Uma tabela de tamanho `(n+1)×(m+1)` é aceitável aqui: o texto-alvo é uma frase de lição e o
 * limite do DTO é de 300 caracteres, não um documento.
 */
function exactPairs(
  expected: readonly string[],
  spoken: readonly string[],
): ReadonlyArray<readonly [number, number]> {
  const rows = expected.length + 1;
  const columns = spoken.length + 1;
  const table: number[][] = Array.from({ length: rows }, () => new Array<number>(columns).fill(0));

  for (let i = expected.length - 1; i >= 0; i -= 1) {
    for (let j = spoken.length - 1; j >= 0; j -= 1) {
      const row = table[i];
      const nextRow = table[i + 1];
      if (!row || !nextRow) continue;
      row[j] =
        expected[i] === spoken[j]
          ? (nextRow[j + 1] ?? 0) + 1
          : Math.max(nextRow[j] ?? 0, row[j + 1] ?? 0);
    }
  }

  const pairs: Array<readonly [number, number]> = [];
  let i = 0;
  let j = 0;
  while (i < expected.length && j < spoken.length) {
    const row = table[i];
    const nextRow = table[i + 1];
    if (!row || !nextRow) break;
    if (expected[i] === spoken[j]) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if ((nextRow[j] ?? 0) >= (row[j + 1] ?? 0)) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return pairs;
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

function statusFor(similarity: number): PronunciationWordStatus {
  if (similarity >= CORRECT_THRESHOLD) return 'correct';
  if (similarity >= NEEDS_WORK_THRESHOLD) return 'needs_work';
  return 'missed';
}

function scoreOf(word: PronunciationWordScore): number {
  if (word.status === 'correct') return 100;
  if (word.status === 'needs_work') return Math.round(word.confidence * 100);
  return 0;
}

/** Cita até três palavras, entre aspas, sem repetir. */
function quoteWords(words: readonly string[]): string {
  return words
    .slice(0, 3)
    .map(word => `“${word}”`)
    .join(', ');
}

function buildFeedback(
  overall: number,
  words: readonly PronunciationWordScore[],
  transcript: string,
): string {
  const spoken = transcript.trim();
  const needsWork = words.filter(word => word.status === 'needs_work').map(word => word.word);
  const missed = words.filter(word => word.status === 'missed').map(word => word.word);

  if (spoken.length === 0) {
    return 'Nenhuma fala foi reconhecida na gravação. Confira o microfone, fale um pouco mais alto e tente de novo.';
  }
  if (words.length === 0) {
    return 'Não há texto-alvo para comparar. Escolha uma frase da lição antes de gravar.';
  }
  if (overall >= 95) {
    return 'Pronúncia muito próxima do modelo. Repita mais uma vez para ganhar fluência.';
  }
  if (overall >= 80) {
    const detail = needsWork.length > 0 ? quoteWords(needsWork) : quoteWords(missed);
    return detail.length > 0
      ? `Boa pronúncia. Ajuste ${detail} e repita a frase inteira.`
      : 'Boa pronúncia. Repita a frase inteira para consolidar o ritmo.';
  }
  if (overall >= 50) {
    const detail = needsWork.length > 0 ? quoteWords(needsWork) : quoteWords(missed);
    return detail.length > 0
      ? `Dá para entender a frase, mas ${detail} saiu diferente do modelo. Ouça a versão lenta e repita essas palavras antes da frase toda.`
      : 'Dá para entender a frase. Ouça a versão lenta e repita, prestando atenção ao ritmo.';
  }
  if (overall === 0) {
    return 'Nenhuma das palavras esperadas foi reconhecida. Ouça o modelo, repita devagar e grave novamente.';
  }
  const detail = missed.length > 0 ? quoteWords(missed) : quoteWords(needsWork);
  return detail.length > 0
    ? `Muitas palavras ficaram distantes do modelo, principalmente ${detail}. Ouça a versão lenta e grave uma palavra por vez.`
    : 'Muitas palavras ficaram distantes do modelo. Ouça a versão lenta e grave uma palavra por vez.';
}

/**
 * Compara a transcrição com o texto-alvo e devolve a avaliação da História 2.
 *
 * Sem transcrição não há avaliação: devolver `0` para "não ouvi nada" e `0` para "ouvi tudo
 * errado" seria a mesma resposta para duas situações diferentes, e é por isso que o serviço
 * distingue os dois casos **antes** de chegar aqui (o endpoint responde `422` quando não há
 * transcrição e o ASR não está configurado).
 */
export function scorePronunciation(
  expectedText: string,
  transcript: string,
): PronunciationEvaluationResult {
  const expected = tokenizeForScoring(expectedText);
  const spoken = tokenizeForScoring(transcript);

  if (expected.length === 0) {
    return {
      overall_score: 0,
      word_scores: [],
      feedback_pt: buildFeedback(0, [], transcript),
    };
  }

  const words: PronunciationWordScore[] = expected.map(word => ({
    word,
    status: 'missed',
    confidence: 0,
  }));

  const exact = exactPairs(expected, spoken);
  const claimedSpoken = new Set<number>();

  for (const [expectedIndex, spokenIndex] of exact) {
    claimedSpoken.add(spokenIndex);
    words[expectedIndex] = {
      word: expected[expectedIndex] ?? '',
      status: 'correct',
      confidence: 1,
    };
  }

  const exactExpected = new Set(exact.map(([expectedIndex]) => expectedIndex));

  for (let i = 0; i < expected.length; i += 1) {
    if (exactExpected.has(i)) continue;

    let bestIndex = -1;
    let bestSimilarity = 0;
    for (let j = 0; j < spoken.length; j += 1) {
      if (claimedSpoken.has(j)) continue;
      const similarity = wordSimilarity(expected[i] ?? '', spoken[j] ?? '');
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestIndex = j;
      }
    }

    if (bestIndex >= 0 && bestSimilarity >= NEEDS_WORK_THRESHOLD) {
      claimedSpoken.add(bestIndex);
      words[i] = {
        word: expected[i] ?? '',
        status: statusFor(bestSimilarity),
        confidence: roundToTwo(bestSimilarity),
      };
    }
  }

  const overall = Math.round(
    words.reduce((total, word) => total + scoreOf(word), 0) / words.length,
  );

  return {
    overall_score: overall,
    word_scores: words,
    feedback_pt: buildFeedback(overall, words, transcript),
  };
}
