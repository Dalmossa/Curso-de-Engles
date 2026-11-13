import type { LessonContent } from './lesson';
import type { CefrLevel } from '../value-objects/cefr-level';

/**
 * Mock lesson data for development and when the API is unavailable.
 *
 * This ensures the lesson page renders correctly even when the backend
 * is not accessible. The structure matches the real LessonContent entity.
 */
const MOCK_LESSON_BASE: Omit<LessonContent, 'lessonId'> = {
  title: 'Saudações e Apresentações Básicas',
  cefrLevel: 'A1' as CefrLevel,
  reuseBasis: 'cite_only',
  authoringState: 'authored',
  publicationState: 'publishable',
  phases: [
    {
      phase: 1,
      heading: 'Input — Compreensão Auditiva e Leitura',
      markdown: `## FASE 1 — Input

### Objetivo
Expor o aprendiz a saudações autênticas em contexto, focando na compreensão global antes da produção.

### Atividade 1: Ouça e Observe
Ouça o diálogo abaixo entre dois colegas de trabalho que se encontram pela manhã.

> **Diálogo 1**
> **Ana:** Good morning, Peter! How are you today?
> **Peter:** Good morning, Ana! I'm fine, thank you. And you?
> **Ana:** I'm very well, thanks for asking.

### Atividade 2: Leia e Compreenda
Leia as saudações formais e informais abaixo. Observe as diferenças de registro.

| Contexto | Saudação | Tradução |
|----------|----------|----------|
| Formal | Good morning, Mr. Silva. | Bom dia, Sr. Silva. |
| Informal | Hi, John! | Oi, John! |
| Neutro | Hello, everyone. | Olá, pessoal. |

### Mini-verificação
**Pergunta:** Qual saudação você usaria com seu chefe pela manhã?
- [ ] Hi, boss!
- [x] Good morning, Mr. [Sobrenome].
- [ ] Hey there!`,
    },
    {
      phase: 2,
      heading: 'Guided Practice — Prática Guiada',
      markdown: `## FASE 2 — Guided Practice

### Objetivo
Praticar as saudações com suporte estruturado, recebendo recast imediato quando necessário.

### Atividade 3: Complete os Diálogos
Complete as lacunas com a saudação apropriada.

1. **Situação:** Encontrar um colega no elevador às 9h.
   \`\`\`
   You: _______, Sarah!
   Sarah: _______! How are you?
   \`\`\`

2. **Situação:** Entrar em uma reunião formal às 14h.
   \`\`\`
   You: _______, everyone.
   Chair: _______. Please take a seat.
   \`\`\`

### Recast Imediato (Micro-ciclo 30–60s)
> **Learner:** "Good morning, John!" (em contexto informal com amigo)
> **Tutor (recast):** "Hi, John!"
> **Learner (uptake):** "Hi, John!"

*Pratique com um parceiro ou use o botão "Por que?" para entender a diferença de registro.*`,
    },
    {
      phase: 3,
      heading: 'Output Task — Tarefa de Produção',
      markdown: `## FASE 3 — Output Task

### Objetivo
Produzir saudações apropriadas em diferentes contextos sem suporte estruturado.

### Atividade 4: Role-play — Cenários do Dia a Dia
Escolha **dois** dos cenários abaixo e grave-se (áudio ou vídeo) cumprimentando a pessoa apropriada.

| Cenário | Pessoa | Registro Esperado |
|---------|--------|-------------------|
| Chegar ao escritório às 8h30 | Recepcionista | Formal/Neutro |
| Encontrar amigo no almoço | Colega próximo | Informal |
| Entrar em call com cliente novo | Cliente | Formal |
| Cumprimentar equipe no Slack | Time todo | Informal/Neutro |

### Critérios de Sucesso
- [ ] Usa saudação adequada ao horário (morning/afternoon/evening)
- [ ] Ajusta o registro (formal/informal) ao contexto
- [ ] Pronúncia inteligível (foco em /θ/ em *thank you*, /ð/ em *the*)`,
    },
    {
      phase: 4,
      heading: 'Formative Check — Verificação Formativa',
      markdown: `## FASE 4 — Formative Check

### Autoavaliação Rápida
Responda honestamente para ajudar o sistema a calibrar seu nível.

1. **Conforto:** Quão confortável você se sente para saudar alguém em inglês?
   - [ ] Muito desconfortável
   - [ ] Um pouco desconfortável
   - [ ] Neutro
   - [ ] Confortável
   - [ ] Muito confortável

2. **Precisão:** Consegue distinguir quando usar *Good morning* vs *Hi* vs *Hello*?
   - [ ] Nunca
   - [ ] Às vezes
   - [ ] Quase sempre
   - [ ] Sempre

### Próximos Passos
- Se marcou "Quase sempre" ou "Sempre" em ambos: avance para **les_a1_personal_info**
- Se marcou opções anteriores: revise a **FASE 1** e pratique com o **Pack de Prática: les_a1_greetings_intro_practice_v1**

---
**DADOS PARA O LEARNER MODEL**
\`\`\`json
{
  "targetSkills": ["listening", "speaking", "vocabulary"],
  "cefrTarget": "A1",
  "prerequisiteLessons": [],
  "vocabularyFocus": ["greetings", "register", "politeness"],
  "grammarFocus": ["imperative", "present simple be"],
  "pronunciationFocus": ["th-sounds", "word-stress"],
  "estimatedDurationMinutes": 15
}
\`\`\``,
    },
  ],
  learnerModel: {
    targetSkills: ['listening', 'speaking', 'vocabulary'],
    cefrTarget: 'A1',
    prerequisiteLessons: [],
    vocabularyFocus: ['greetings', 'register', 'politeness'],
    grammarFocus: ['imperative', 'present simple be'],
    pronunciationFocus: ['th-sounds', 'word-stress'],
    estimatedDurationMinutes: 15,
  },
};

/**
 * Returns a mock lesson with the given lessonId.
 * Used as fallback when the API is unavailable.
 */
export function getMockLesson(lessonId: string): LessonContent {
  return {
    ...MOCK_LESSON_BASE,
    lessonId,
  };
}