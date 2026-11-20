# Lesson: Writing: Narrating the Past

**Lesson ID:** `les_a2_writing_past`
**Module:** `mod_a2_skills_rw`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: escrevendo o resumo do incidente da semana

> **Bruno (backend developer, São Paulo):** "The payment incident is closed. I need to write the summary before the retro."
>
> **Ana (SRE, remote):** "Good. Start with the timeline — what happened first?"
>
> **Bruno:** "First, the deploy finished at 09:02. Then, the error rate went up."
>
> **Ana:** "Write it in past simple: 'The deploy finished at 09:02. The error rate went up.' Keep the same tense in every line."
>
> **Bruno:** "OK. Meanwhile, the queue was growing, and the on-call engineer saw the alert."
>
> **Ana:** "Nice. Then say what you did: 'I checked the logs, found the bad config, and rolled back.'"
>
> **Bruno:** "Finally, we restored the service at 09:26. I'll put the timeline in the incident channel."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **First, ... Then, ... Finally, ...** | Primeiro ... Depois ... Por fim ... | Marcadores de sequência: abrem cada passo da linha do tempo e mantêm o leitor orientado. |
| **Meanwhile, ...** | Enquanto isso ... | Ação paralela; *meanwhile* nunca significa "meio" (isso é *middle*). |
| **Suddenly, ...** | De repente ... | Introduz o evento inesperado do incidente. |
| **Eventually, ...** | No fim / Afinal ... | **Falso cognato:** *eventually* não é "talvez" — para "talvez", use *maybe*. |
| **Afterward, ...** | Depois disso ... | Em en-US, *afterward* (sem *s*) é a forma preferida; *afterwards* também existe. |
| **I checked the logs.** | Eu verifiquei os logs. | Passado simples regular: *-ed* com som final /t/. |
| **I found the bad config.** | Eu encontrei a configuração errada. | Irregular: *find → found*. Nunca *finded*. |
| **The error rate went up.** | A taxa de erro subiu. | Irregular: *go → went*; *up* completa o phrasal verb. |
| **I didn't see the alert.** | Eu não vi o alerta. | Depois de *didn't*, o verbo volta à forma base: *see*, não *saw*. |
| **I rolled back the deploy.** | Eu fiz rollback do deploy. | *Roll back* é o phrasal verb de revert uma versão. |
| **had + particípio** | tinha feito / havia feito | Para um evento **anterior** ao ponto de partida da história. No A2, mantenha o corpo do resumo no passado simples; esse recurso vira na sequência. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "I arrive at 9 and I check the logs." (falando do passado) | "I **arrived** at 9 and I **checked** the logs." | Narrativa no passado exige consistência de tempo; não alterne entre presente e passado. |
| "I didn't **saw** the alert." | "I didn't **see** the alert." | A negação já carrega o passado em *did*; o verbo principal fica na base. |
| "**Went** to the server room at 09:10." | "**I went** to the server room at 09:10." | Inglês pede sujeito explícito; em pt-BR podemos omitir "eu". |
| "**Eventually** we will roll back." (querendo dizer "talvez") | "**Maybe** we will roll back." / "**Eventually** we rolled back." (querendo dizer "no fim") | *Eventually* fala do desfecho, não de possibilidade. |
| "The logs I checked at 09:05." | "I **checked the logs** at 09:05." | Ordem SVO: sujeito → verbo → objeto. |
| "I have **went** to the dashboard." | "I **went** to the dashboard." | *Went* é o passado simples; *have gone* exigiria o particípio *gone*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (linha do tempo consistente)

Qual versão do resumo mantém todos os eventos no passado simples com conectores de sequência?

| Opção | Frase |
|---|---|
| A | "First, the deploy finished at 09:02. Then, the error rate **goes** up. Finally, we rolled back." |
| B | "First, the deploy finished at 09:02. Then, the error rate **went** up. Finally, we rolled back." |
| C | "First, the deploy **finish** at 09:02. Then, the error rate went up. Finally, we rolled back." |
| D | "First, **finished the deploy** at 09:02. Then, **went up the error rate**. Finally, we rolled back." |

**Key:** B

A mistura de tempos em A quebra a narrativa, C deixa *finish* sem marca de passado e D inverte a ordem SVO; só B mantém passado simples e sequência.

### Exercício 2 — Complete (verbos regulares e irregulares)

Complete o trecho do relatório com o passado simples dos verbos entre parênteses:

1. "At 09:02 the deploy ______ (finish)."
2. "The error rate ______ (go) up in two minutes."
3. "I ______ (find) a bad config in the queue settings."
4. "We ______ (roll) back at 09:26."

**Key:** 1) finished; 2) went; 3) found; 4) rolled.

*Finish* e *roll* recebem *-ed*; *go → went* e *find → found* são irregulares e não admitem *-ed*.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural, mantendo sujeito explícito e passado simples:

| Português (intenção) | Resposta esperada |
|---|---|
| "Cheguei às 9 e verifiquei os logs." | "I arrived at 9 and I checked the logs." |
| "Não vi o alerta." | "I didn't see the alert." |
| "Fui para a sala dos servidores às 09:10." | "I went to the server room at 09:10." |

**Key:** ver tabela.

Note que *didn't see* usa a base do verbo e que *I went* retoma o sujeito que o português deixaria implícito.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

First, the deploy finished at 09:02.
Then, the error rate went up and the queue was growing.
Meanwhile, the on-call engineer saw the alert and checked the dashboard.
I found the bad config, we rolled back, and the service recovered at 09:26.
Finally, I wrote the summary and posted it in the incident channel.

### Foco articulatório para falantes de pt-BR

- **-ed final /t/ em *finished, checked, posted***: depois de consoante sem voz (/ʃ/, /t/, /k/), o *-ed* soa /t/ — *checked* é /tʃekt/, uma sílaba só, nunca "check-ed".
- **-ed final /d/ em *recovered, arrived, called***: depois de som com voz, o *-ed* soa /d/ e também não cria sílaba extra.
- **-ed final /ɪd/ em *started, needed***: depois de /t/ ou /d/, o *-ed* ganha sílaba própria — *started* é /ˈstɑːrtɪd/.
- **Irregulares não levam -ed**: *go → went* /went/, *find → found* /faʊnd/, *see → saw* /sɔː/. Dizer *goed* ou *finded* é transferência direta da regra do regular.
- **/ð/ em *the, the alert, the dashboard***: ponta da língua entre os dentes com voz; evite trocar por /d/ ("de alert").

### Prompt de produção (escrita)

Escreva um parágrafo de 5 a 6 sentenças — um resumo de incidente, uma retro curta ou uma entrada de changelog — sobre algo que realmente aconteceu no seu trabalho. Requisitos:

1. Comece com **First** e use pelo menos mais dois conectores de sequência (**Then**, **Meanwhile**, **Suddenly**, **Finally** ou **Afterward**).
2. Use pelo menos três verbos irregulares no passado (*go → went*, *see → saw*, *find → found*, *write → wrote*, *take → took*).
3. Mantenha o passado simples em todas as sentenças — não misture com presente.
4. Inclua um sujeito explícito em cada sentença (*I*, *we*, *the service*, *the team*, *the on-call engineer*).
5. Termine com o desfecho e um horário aproximado. Se possível, inclua um detalhe real do seu contexto (serviço, ticket, janela de deploy).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "Eventually, we rolled back.", o que *eventually* significa?  
   A) "Talvez."  B) "No fim / Afinal."  C) "Imediatamente."  D) "De repente."  
   **Key:** B  
   *Eventually* marca o desfecho da sequência; "talvez" seria *maybe*, e "de repente" seria *suddenly*.

2. **Gramática (L1):** Qual frase mantém a narrativa consistente no passado?  
   A) "I arrived at 9 and I check the logs."  B) "I arrive at 9 and I checked the logs."  C) "I arrived at 9 and I checked the logs."  D) "I arriving at 9 and I check the logs."  
   **Key:** C  
   As duas ações concluídas pedem passado simples (*arrived* e *checked*); A e B misturam tempos e D não tem verbo finito.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_a2_writing_past_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_writing_past",
  "cefr_level": "A2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "reading", "pronunciation", "writing"],
  "output_modalities": ["writing"],
  "skill_items": {
    "grammar": [
      "grammar.past_narrative_sequence",
      "grammar.past_simple_irregular",
      "grammar.tense_consistency"
    ],
    "vocabulary": [
      "vocab.past_narrative_connectors",
      "vocab.past_narrative_report_terms",
      "vocab.incident_timeline"
    ],
    "reading": [
      "reading.incident_note_detail",
      "reading.postmortem_sequence"
    ],
    "listening": [
      "listening.past_narrative_context"
    ],
    "pronunciation": [
      "pronunciation.ed_past_final"
    ],
    "writing": [
      "writing.past_narrative"
    ]
  },
  "prereq_lessons": [
    "les_a1_regular_verbs_past",
    "les_a2_greetings_intro",
    "les_a2_small_talk",
    "les_a2_introducing_others",
    "les_a2_meeting_open",
    "les_a2_meeting_participate",
    "les_a2_email_basics",
    "les_a2_phone_calls",
    "les_a2_ask_for_help",
    "les_a2_deadlines_tasks",
    "les_a2_feedback_praise",
    "les_a2_corporate_wrapup",
    "les_a2_corpus_intro",
    "les_a2_past_narrative",
    "les_a2_future_will",
    "les_a2_present_continuous",
    "les_a2_modals_can_need",
    "les_a2_imperatives",
    "les_a2_prepositions_basic",
    "les_a2_travel_vocab_core",
    "les_a2_collocations",
    "les_a2_stress_timing",
    "les_a2_airport",
    "les_a2_hotel_taxi",
    "les_a2_restaurant_shopping",
    "les_a2_reading_strategy",
    "les_a2_writing_svo",
    "les_a2_writing_bio",
    "les_a2_writing_messages"
  ],
  "estimated_time_min": 15
}
```
