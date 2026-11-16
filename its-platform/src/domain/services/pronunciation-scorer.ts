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
 *    parecida (`reviu` ~ `review`) vira `needs_work`, não `missed`.
 * 3. **`missed` ≠ `needs_work`.** Ausência (a palavra não foi reconhecida) e desvio (foi, mas
 *    soou diferente) pedem ações diferentes do aprendiz. Confundi-las num único "errado" é o
 *    tipo de feedback que o sistema existe para evitar.
 */

/** Uma palavra-alvo e o quão próximo o que se ouviu chegou dela. */
export interface PronunciationWordScore {
  /** A palavra do texto-alvo, como o aprendiz a leu (normalizada). */
  readonly word: string;
  /** `missed` = ausência; `needs_work` = desviou; `correct` = igual. */
  readonly status: 'correct' | 'needs_work' | 'missed';
  /** Quanto do esperado apareceu, 0–1. `1` só quando igual. */
  readonly confidence: number;
}

/** A avaliação completa que o endpoint devolve e que o contrato publica. */
export interface PronunciationEvaluation {
  /** Média das palavras-alvo, 0–100. Não é "percentual de acerto": `needs_work` conta parcial. */
  readonly overall_score: number;
  /** Uma entrada por palavra-alvo, na ordem em que a frase foi escrita. */
  readonly word_scores: readonly PronunciationWordScore[];
  /** Uma frase em pt-BR, curta, dizendo o próximo passo — não um laudo. */
  readonly feedback_pt: string;
  /** A transcrição que foi comparada (a que o ASR ouviu), para o aprendiz ver o contraste. */
  readonly transcript: string;
  /** Dicas contrastivas opcionais (pt-BR → en-US), focadas nas palavras que pedem ajuste. */
  readonly contrastive_tips?: readonly string[];
}

/**
 * O chão a partir do qual uma palavra "parecida" conta como reconhecimento parcial, não como
 * ausência. Abaixo disso, a distância é grande demais para ser um desvio de pronúncia — é outra
 * palavra (ou ruído) no lugar.
 */
const NEEDS_WORK_FLOOR = 0.5;
/** Acima disso, a diferença é pequena o bastante para não valer uma correção. */
const CORRECT_FLOOR = 0.9;

const TOKEN_PATTERN = /\p{L}+(?:'\p{L}+)*/gu;

/**
 * Quebra o texto em tokens comparáveis: só letras (inclui acentos) e o apóstrofo interno de
 * contrações (`don't`). Caixa e pontuação somem aqui — a frase "Hello, world!" vira
 * `['hello', 'world']`.
 *
 * Exportada porque os testes a usam para fixar o contrato de normalização sem precisar montar uma
 * avaliação inteira, e porque a regra "o que conta como palavra" merece um lugar com nome.
 */
export function tokenizeForScoring(text: string): string[] {
  const matches = text.toLowerCase().match(TOKEN_PATTERN);
  return matches ? [...matches] : [];
}

/**
 * Distância de Levenshtein — o número mínimo de edições (inserir, remover, trocar) para
 * transformar `a` em `b`. Duas linhas de memória bastam: cada célula depende só da linha de cima
 * e da anterior da linha atual.
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  let current = new Array<number>(b.length + 1).fill(0);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    const charA = a[i - 1];
    for (let j = 1; j <= b.length; j++) {
      const cost = charA === b[j - 1] ? 0 : 1;
      const deletion = previous[j]! + 1;
      const insertion = current[j - 1]! + 1;
      const substitution = previous[j - 1]! + cost;
      current[j] = Math.min(deletion, insertion, substitution);
    }
    [previous, current] = [current, previous];
  }

  return previous[b.length]!;
}

/**
 * Similaridade 0–1 entre duas palavras. `1` é idêntica; `0` é completamente diferente. A
 * normalização pela maior das duas comprimentos impede que uma palavra curta pareça "perto" de
 * qualquer prefixo dela.
 *
 * Exportada pelo mesmo motivo de `tokenizeForScoring`: é uma peça da decisão, e vale testá-la
 * onde ela mora.
 */
export function wordSimilarity(expected: string, actual: string): number {
  if (expected === actual) return 1;
  const longest = Math.max(expected.length, actual.length);
  if (longest === 0) return 1;
  return 1 - levenshtein(expected, actual) / longest;
}

/**
 * Pares (índice em `expected`, índice em `actual`) que formam uma maior subsequência comum. São
 * as âncoras: palavras iguais, na mesma ordem relativa, que o alinhamento não tem o direito de
 * separar — é o que impede a inserção de "really" de contaminar "need", "this", "now".
 */
function longestCommonSubsequence(expected: string[], actual: string[]): Array<[number, number]> {
  const rows = expected.length + 1;
  const cols = actual.length + 1;
  // Tabela achatada `rows × cols`: dp[i][j] vive em `i * cols + j`.
  const dp = new Array<number>(rows * cols).fill(0);

  for (let i = 1; i <= expected.length; i++) {
    for (let j = 1; j <= actual.length; j++) {
      const index = i * cols + j;
      if (expected[i - 1] === actual[j - 1]) {
        dp[index] = dp[(i - 1) * cols + (j - 1)]! + 1;
      } else {
        const up = dp[(i - 1) * cols + j]!;
        const left = dp[i * cols + (j - 1)]!;
        dp[index] = up >= left ? up : left;
      }
    }
  }

  const pairs: Array<[number, number]> = [];
  let i = expected.length;
  let j = actual.length;
  while (i > 0 && j > 0) {
    if (expected[i - 1] === actual[j - 1]) {
      pairs.push([i - 1, j - 1]);
      i -= 1;
      j -= 1;
    } else if (dp[(i - 1) * cols + j]! >= dp[i * cols + (j - 1)]!) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  pairs.reverse();
  return pairs;
}

/** A palavra mais parecida de um trecho, e quão parecida — ou `null` se o trecho está vazio. */
function bestMatch(
  word: string,
  candidates: readonly string[],
): { candidate: string; similarity: number } | null {
  let best: { candidate: string; similarity: number } | null = null;
  for (const candidate of candidates) {
    const similarity = wordSimilarity(word, candidate);
    if (best === null || similarity > best.similarity) {
      best = { candidate, similarity };
    }
  }
  return best;
}

/** Classifica uma palavra-alvo contra o melhor que o trecho ouvido oferece. */
function scoreWord(expected: string, heard: readonly string[]): PronunciationWordScore {
  if (heard.length === 0) {
    return { word: expected, status: 'missed', confidence: 0 };
  }

  const match = bestMatch(expected, heard);
  if (match === null) {
    return { word: expected, status: 'missed', confidence: 0 };
  }

  if (match.similarity === 1) {
    return { word: expected, status: 'correct', confidence: 1 };
  }

  if (match.similarity >= NEEDS_WORK_FLOOR) {
    // Duas casas decimais: o contrato declara "similarity observed, rounded to two decimals".
    const confidence = Math.round(match.similarity * 100) / 100;
    const status = match.similarity >= CORRECT_FLOOR ? 'correct' : 'needs_work';
    return { word: expected, status, confidence };
  }

  // Parecido demais pouco: trata como se a palavra esperada não tivesse sido dita — o que foi
  // ouvido era outra coisa.
  return { word: expected, status: 'missed', confidence: 0 };
}

/**
 * Alinha `expected` e `actual` e devolve, para cada palavra-alvo, o trecho do que foi ouvido
 * que compete por ela. O trecho é "o que sobrou entre a âncora anterior e a próxima"; palavras
 * soltas inseridas no meio ficam nesse trecho e não empurram nada.
 */
function alignedHeardSegments(expected: string[], actual: string[]): string[][] {
  const anchors = longestCommonSubsequence(expected, actual);
  const segments: string[][] = expected.map(() => []);
  let previousExpected = -1;
  let previousActual = -1;

  for (const [expectedIndex, actualIndex] of anchors) {
    const gap: string[] = [];
    for (let j = previousActual + 1; j < actualIndex; j++) {
      const token = actual[j];
      if (token !== undefined) gap.push(token);
    }
    // O trecho entre âncoras pertence às palavras-alvo desse intervalo. Atribuí-lo à próxima
    // âncora (ou à última palavra do intervalo) é um compromisso: um desvio de UMA palavra não
    // deve contaminar as vizinhas, e a LCS já nos deu onde a frase "se reencontra".
    if (expectedIndex - previousExpected > 1) {
      // Há palavras-alvo sem âncora entre a anterior e esta: o trecho compete pela primeira delas.
      const owner = previousExpected + 1;
      segments[owner] = gap;
    }
    segments[expectedIndex] = [actual[actualIndex]!];
    previousExpected = expectedIndex;
    previousActual = actualIndex;
  }

  const tail: string[] = [];
  for (let j = previousActual + 1; j < actual.length; j++) {
    const token = actual[j];
    if (token !== undefined) tail.push(token);
  }
  if (previousExpected < expected.length - 1) {
    segments[previousExpected + 1] = tail;
  }

  return segments;
}

function roundScore(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function formatWordList(words: readonly string[]): string {
  const quoted = words.map(word => `"${word}"`);
  if (quoted.length === 1) return quoted[0]!;
  if (quoted.length === 2) return `${quoted[0]} e ${quoted[1]}`;
  return `${quoted.slice(0, -1).join(', ')} e ${quoted[quoted.length - 1]}`;
}

function buildFeedback(score: number, missed: string[], needsWork: string[]): string {
  if (missed.length === 0 && needsWork.length === 0) {
    return score >= 95
      ? 'Pronúncia muito clara. Repita em ritmo natural para ganhar fluência.'
      : 'Boa leitura. Ouça o modelo mais uma vez e repita com calma para arredondar os sons.';
  }

  const detail =
    missed.length > 0
      ? `não apareceu com clareza: ${formatWordList(missed.slice(0, 3))}`
      : `pediu um pouco mais de atenção: ${formatWordList(needsWork.slice(0, 3))}`;

  if (score < 40) {
    return `Muitas palavras ficaram distantes do modelo, principalmente ${detail}. Ouça a versão lenta e grave uma palavra por vez.`;
  }

  return `Você foi bem no geral. A palavra que ${detail}. Ouça o modelo e tente de novo.`;
}

// --- Regras contrastivas (pt-BR → en-US, contexto TI) -----------------------

const EPENTHETIC_WORDS = new Set([
  'debug',
  'bug',
  'deploy',
  'build',
  'script',
  'test',
  'request',
  'cache',
  'stack',
  'branch',
]);

const TH_WORDS = new Set([
  'throughput',
  'thread',
  'threshold',
  'through',
  'method',
  'with',
  'this',
  'that',
]);

const CONTRASTIVE_RULES: ReadonlyArray<{ words: readonly string[]; tip: string }> = [
  {
    words: ['ship', 'sheep'],
    tip: 'Atenção ao contraste /ɪ/ x /iː/ em "ship/sheep": em "ship" o som é curto; em "sheep" mantenha o /i/ longo, sem encurtar.',
  },
  {
    words: ['live', 'leave'],
    tip: 'Em "live" (curto /ɪ/) e "leave" (longo /iː/), alongue o som apenas em "leave"; não acrescente vogal final.',
  },
  {
    words: ['pull', 'pool'],
    tip: 'Diferencie "pull" (/ʊ/, curto) de "pool" (/uː/, longo): arredonde e alongue os lábios só em "pool".',
  },
  {
    words: ['host', 'ghost'],
    tip: 'Em "host" a vogal é mais aberta; em "ghost" mantenha o /oʊ/ e pronuncie o "gh" como /g/ inicial (não silencie).',
  },
  {
    words: ['release'],
    tip: 'Em "release", mantenha o /iː/ longo na sílaba "-lease" e evite reduzir para um som curto de /i/.',
  },
  {
    words: ['query'],
    tip: 'Em "query", pronuncie o "qu" como /kw/ e evite inserir vogal extra entre as consoantes.',
  },
  {
    words: ['queue'],
    tip: 'Em "queue", o som principal é /kjuː/ (parecido com "cue"): não leia letra por letra e mantenha o /uː/ longo.',
  },
  {
    words: ['asynchronous'],
    tip: 'Em "asynchronous", destaque o "th" como som dental (não /s/ ou /t/) e evite acrescentar vogais entre consoantes.',
  },
];

function buildContrastiveTips(problematic: readonly PronunciationWordScore[]): readonly string[] {
  const tips: string[] = [];
  const seen = new Set<string>();

  const add = (key: string, tip: string): void => {
    if (seen.has(key)) return;
    seen.add(key);
    tips.push(tip);
  };

  for (const item of problematic) {
    if (item.status !== 'needs_work' && item.status !== 'missed') continue;
    const word = item.word.toLowerCase();

    if (EPENTHETIC_WORDS.has(word)) {
      add(
        `epenthetic:${word}`,
        `Em "${word}", evite acrescentar uma vogal no final (ex.: "${word}-i"): finalize a consoante de forma seca, comum em termos de engenharia de software.`,
      );
    }
    if (TH_WORDS.has(word)) {
      add(
        `th:${word}`,
        `Em "${word}", o "th" é um som dental: coloque a ponta da língua entre os dentes e solte o ar (não substitua por /t/, /d/, /s/ ou /f/).`,
      );
    }
    for (const rule of CONTRASTIVE_RULES) {
      if (rule.words.includes(word)) {
        add(`rule:${rule.words.join('/')}`, rule.tip);
      }
    }
  }

  return tips;
}

/**
 * Compara o que se esperava ouvir (`expectedText`) com o que foi transcrito (`transcript`) e
 * devolve a nota palavra a palavra. É determinístico para a mesma entrada — não consulta modelo
 * algum, porque o modelo já falou: ele falou na transcrição.
 */
export function scorePronunciation(
  expectedText: string,
  transcript: string,
): PronunciationEvaluation {
  const expected = tokenizeForScoring(expectedText);
  const actual = tokenizeForScoring(transcript);

  if (expected.length === 0) {
    return {
      overall_score: 0,
      word_scores: [],
      feedback_pt: 'Não há texto-alvo para comparar. Verifique a frase da atividade.',
      transcript,
      contrastive_tips: [],
    };
  }

  const segments = alignedHeardSegments(expected, actual);
  const wordScores = expected.map((word, index) => scoreWord(word, segments[index] ?? []));

  const total = wordScores.reduce((sum, word) => sum + word.confidence, 0);
  const overall = roundScore((total / expected.length) * 100);
  const missed = wordScores.filter(word => word.status === 'missed').map(word => word.word);
  const needsWork = wordScores.filter(word => word.status === 'needs_work').map(word => word.word);
  const contrastiveTips = buildContrastiveTips(wordScores);

  return {
    overall_score: overall,
    word_scores: wordScores,
    feedback_pt: buildFeedback(overall, missed, needsWork),
    transcript,
    contrastive_tips: contrastiveTips,
  };
}
