# Fase A3 — Um contrato, um leitor

**Data:** 2026-10-14 · branch `main` · `1c91e0e` → **`1d0e4f8`** (5 commits; **não há remoto configurado** — nada foi publicado, e `git remote -v` é vazio)
**Escopo:** remoção de `docs/api/openapi.yaml` (ADR-040 D3), os seus leitores, `tests/contract/`, `scripts/contract-gate.mjs`, o job de CI, `CHANGELOG.md`, `docs/adr/040` + `docs/adr/README.md`, skill `openapi-spec`. **Nenhum endpoint novo, nenhuma rota nova, nenhuma tabela, nenhum DTO, nenhuma linha de `src/` tocada.**
**Veredito:** ✅ **A3 concluída** — D3 fechado, ADR-040 `Accepted`, e não resta no repositório nenhum arquivo vivo que afirme o contrário.
**Bloqueios que continuam:** H-1/H-2/H-3 (ADRs 041/042/043 seguem `Proposed`; você não autorizou decidir) e o **portão de aposentadoria sem instrumento** (§8.3).

---

## 1. Tarefas e veredito

| # | Tarefa (A3) | Veredito | Evidência |
|---:|---|---|---|
| 1 | **C1 / D5.1** — `schemas.spec.ts` lê **um** documento: `SPEC_PATHS` → um caminho, fim da cerca tolerada, guarda de drift removida com o segundo documento | ✅ feito | `ed6b96b`; `schemas.spec.ts` **27 → 13** testes |
| 2 | **C2 / D5** — `openapi.spec.ts` e `endpoints.spec.ts` saem (subsumidos), e a **única** obrigação que só eles cobriam entra no gate com controle negativo | ✅ feito | `685ea4f`; gate PASS com 14/14; **N-18** vermelho |
| 3 | **D3 — os leitores** — `contract-check.mjs` e `scripts/contract-check-full.mjs` retirados; job de CI `contract-check` → `contract-gate`; `test-all.mjs`; `package.json` | ✅ feito | `0d841e4`; 15 jobs, **0** `needs` órfãos |
| 4 | **D3(b)/D3(c)** — aviso de depreciação no próprio arquivo + entrada no `CHANGELOG.md` com o caminho de migração | ✅ feito | `3f465f8`; §4.4, linha *Changelog* |
| 5 | **D3 — a remoção** — `git rm docs/api/openapi.yaml`; afirmações no presente corrigidas; ADR-040 → `Accepted` + adendo; `docs/adr/README.md` | ✅ feito | `1d0e4f8`; 786 linhas |
| 6 | **C6** — este relatório | ✅ feito | este arquivo |

**Contagem:** 5 commits, **+186 / −1872 em 29 arquivos** (medido: `git diff --shortstat 1c91e0e..HEAD`). **A3 é uma fase de contrato**: ela não muda o que a API faz, e sim **quantas cópias do contrato existem e quem as lê**. Tudo o que A0 mediu como quebrado no comportamento (BOLA, RLS inalcançável, `items[].key` servido, 8 de 12 rotas mock, `/auth/refresh`) continua onde estava, por desenho — é A4/A5/A6. Nenhuma linha de `src/` foi tocada.

---

## 2. Achados

### 2.1 O que decide se um teste pode morrer não é *quem lê o arquivo*, é **que obrigação só ele cobre**

ADR-040 D3 foi escrito como uma lista de **leitores** ("repontar os cinco"). Repontar um leitor não
diz nada sobre os **testes**: um teste pode ler o mesmo arquivo que outro e ainda ser o único a
verificar uma coisa. Foi o que aconteceu, e só apareceu quando o inventário de obrigações foi
levantado bloco a bloco:

| arquivo | blocos | subsumido por |
|---|---|---|
| `openapi.spec.ts` (1 teste) | 8 `toContain` de path | as 20 asserções de path × método de `endpoints.spec.ts` (os mesmos 10 paths) — que são, por sua vez, subsumidas pelo gate |
| `endpoints.spec.ts` (22) | paths × métodos (20) | gate (spec × rotas, nos dois sentidos, método por método) |
| `endpoints.spec.ts` | `404` em `GET` com parâmetro (1) | gate (regra `404`, R6/ADR-038) |
| `endpoints.spec.ts` | **todo 4xx/5xx referencia `Problem`** (1) | **ninguém** |

A contraintuitiva: o arquivo **grande** (22 testes) era 95% subsumido e o **pequeno** (1 teste) 100%
— e a única asserção do repositório inteiro que existia num só lugar era uma do arquivo grande. A
ordem escolhida para o commit obedece a isso: a regra entra no gate **no mesmo commit** que apaga os
arquivos. Se a remoção viesse antes, o commit do meio teria uma obrigação a menos e o gate ainda
verde para não dizer isso.

### 2.2 Doze artefatos compilados estavam rastreados ao lado das fontes — 92 no repositório

`git ls-files` devolve **92** arquivos `*.spec.{js,js.map,d.ts,d.ts.map}` rastreados, cópias
compiladas de testes que **ninguém coleta**: o `jest.config.ts` só casa `*.spec.ts` (medido:
`jest --listTests` = **22 arquivos, 22 `*.spec.ts`**), e nada os importa (o `grep` só encontra os
`sourceMappingURL` que eles fazem de si mesmos). Doze estavam em `tests/contract/`, e descreviam
exatamente os arquivos que A3 remove — cópias de um contrato de dois documentos atrás.

Eles **não** quebram gate hoje: `tsc -p tsconfig.test.json --noEmit` já falha por outro motivo
(`TS6059` em todos os arquivos de teste — `rootDir: ./src` contra `include: tests/**`; é o follow-up
P2.1 de `MEMORY.md`, ainda aberto). Ou seja: não são uma regressão, são **lixo que se parece com
teste**, e o custo de mantê-los cresce na direção do gate que se quer construir.

A3 removeu os **12 da sua superfície** (deles, 4 em `ed6b96b` e 8 em `685ea4f`); os outros **80**
ficam registrados aqui e em §9, porque removê-los é uma classe diferente ("artefatos compilados
rastreados no repo") e R8 manda uma classe por commit — e nada da A3 os toca.

### 2.3 O gate novo afirmava ter substituído um gate que continuava **ligado**

`CHANGELOG.md` dizia, desde A2, que `contract:gate` "replaced a 31-line `String.includes` check".
Era falso enquanto o substituído continuava wired em **quatro** lugares: `package.json`
(`contract:check`), o job `contract-check` do CI, `scripts/test-all.mjs:40` e o comentário de
`kong-config-check.mjs:8`. Ninguém percebeu porque **nenhum gate lê o `CHANGELOG.md`** — e é a mesma
classe do achado §2.2 de A2 ("duas entradas do CHANGELOG descreviam um estado que o código nunca
teve"). A3 não só remove o arquivo: torna a frase verdadeira, e verifica por medição em vez de
leitura (o YAML do workflow parseia; todo `needs:` resolve para um job definido).

### 2.4 A entrada de CHANGELOG de D3 estava agendada para **A2** e não aconteceu

O item do plano de ADR-040 dizia "A2 — `CHANGELOG.md` com a entrada de D3 **antes do merge**". O
merge de A2 aconteceu sem ela. Não houve dano (o arquivo só é removido agora, e o registro existe
antes da remoção, que é o que a §4.4 exige), mas é um item marcado como "de A2" que só fechou em A3 —
e o registro honesto é dizer isso no lugar onde a checagem é feita, não apagar a linha.

### 2.5 O ADR dizia "cinco leitores"; o estado real na abertura de A3 era **três**

A2 repontou dois deles no caminho (`scripts/kong-config-check.mjs` e
`tests/contract/endpoints.spec.ts`). Medido no início de A3: **três leitores vivos**, não cinco. Isso
importa porque o número é a instrução: um plano que diz "cinco" e encontra três, se executado
literalmente, sai procurando dois fantasmas — ou, pior, "repontando" o que já foi repontado e
deixando os dois que **realmente** leem o arquivo.

E há uma divergência de **espécie**, não de número: para `contract-check.mjs` e
`scripts/contract-check-full.mjs` "repontar" seria *manter* dois gates duplicados apontando para o
canônico — o defeito que o ADR-040 existe para remover. **Retirar** é o que D3 quer dizer (D5.1 tem
precedência sobre a redação literal). O ADR ganhou um adendo pós-aceitação com a disposição medida de
cada leitor, em vez de um checklist marcado que descreveria uma execução que não houve.

### 2.6 A §4.4 **não** governa um arquivo — e essa distinção precisou ser escrita

D3(b) pede um aviso de depreciação com data de remoção. A §4.4 tem duas linhas que *parecem* mandar
nisso, e nenhuma manda:

- a linha *Deprecation* diz o que "um **recurso** deprecado emite" — headers `Deprecation`/`Sunset`
  na resposta, com janela mínima de 90/180 dias;
- a linha *Retirement gate* governa a aposentadoria de uma **versão**.

Um arquivo YAML no repositório não é recurso e não emite header nenhum; não há resposta sobre a qual
contar 90 dias. O que obriga é a linha *Changelog* da mesma §4.4 ("every breaking change is recorded
in `CHANGELOG.md` with the migration path before the change merges") — e é essa que A3 satisfaz.

A distinção foi escrita **no cabeçalho do próprio arquivo** e na entrada do CHANGELOG, não só no
commit: um leitor futuro que visse "depreciação sem 90 dias de aviso" poderia ler omissão onde houve
adequação de instrumento. Se você discordar da leitura — se um documento de repositório deve seguir a
janela de 90 dias —, é decisão sua, e a A3 executou o oposto; §8.4.

### 2.7 O que sobra afirmando o contrário — e é **datado**, não vivo

Medido por `grep`, e classificado um a um:

| onde | por que fica |
|---|---|
| `docs/api/inventario.md` | snapshot datado ("estado em A0 (2026-10-14)", declarado read-only) |
| `reports/api/fase-0..2.md` | relatórios datados de fases anteriores |
| ADR-027 `:381,394,480,496`, ADR-030 `:100`, ADR-031 `:99`, ADR-033 `:48,104,239`, ADR-034 `:52` | corpos de ADR **datados**, que registraram a medição da sua data |
| ADR-040 | idem — as citações `:linha` apontam para arquivos que A3 apagou de propósito, e o adendo diz isso |
| `scripts/kong-config-check.mjs:53` | fala no passado ("re-pointed from…") |
| `BACKLOG.md:77`, `MEMORY.md:5,19-21` | linhas de histórico do item P0.8s / P1.12 |

A regra aplicada: **documento datado registra a sua data; documento vivo afirma o presente.** A3
corrigiu os vivos (`docs/api-spec.md`, a skill, o ADR-040, o `README` dos ADRs) e não reescreveu
nenhum datado — reescrever um deles faria a medição que ele registra parecer ter sido feita noutro
estado.

---

## 3. Arquivos / commits

| commit | classe | arquivos | Δ (medido por `git show --shortstat`) |
|---|---|---|---|
| `ed6b96b` | `test(contract)` — um documento só | `tests/contract/schemas.spec.ts` + os 4 artefatos de `schemas.spec.*` | 5 arq., **+41 / −770** |
| `685ea4f` | `test(contract)` — os subsumidos saem, a obrigação única entra no gate | gate, `gate.spec.ts`, `openapi.spec.ts` + `endpoints.spec.ts` e seus 8 artefatos | 12 arq., +28 / −217 |
| `0d841e4` | `chore(contract)` — o gate substituído sai | `contract-check.mjs`, `contract-check-full.mjs`, `package.json`, `ci.yml`, `test-all.mjs`, `contract-gate.mjs`, `kong-config-check.mjs`, `gate.spec.ts` | 8 arq., +22 / −91 |
| `3f465f8` | `docs(api)` — aviso + CHANGELOG | `docs/api/openapi.yaml`, `CHANGELOG.md` | 2 arq., +16 |
| `1d0e4f8` | `docs(api)` — remoção + referências no presente | `docs/api/openapi.yaml` (removido), `docs/api-spec.md`, `docs/adr/040`, `docs/adr/README.md`, skill `openapi-spec` | 5 arq., +94 / −809 |

Nenhum arquivo de `src/` foi tocado.

---

## 4. Saídas dos gates — ANTES → DEPOIS

| Gate | A2 (antes) | A3 (depois) | O que mudou |
|---|---|---|---|
| `npm run test:gate` | ✅ 360 passed / 5 failed (allowlist) / 8 skipped / **373** | ✅ **324 passed / 5 failed (allowlist) / 8 skipped / 337** | **−36** testes: contrato 68 → 32 (−37 de remoções, +1 de N-18) |
| `npm run contract:gate` | ✅ PASS | ✅ PASS | +1 regra (`Problem` por resposta de erro); 14/14 conformes |
| `npm run contract:check` | ✅ PASS | **não existe mais** | retirado (D5.1); `npm run contract:check` → `npm error` |
| `npm run kong:check` | ✅ PASS (1 serviço, 5 rotas, 3 plugins, 9 asserções) | ✅ inalterado | só o comentário `:8` |
| `npm run domain:check` | ✅ 23/0 | ✅ 23/0 | — |
| `npm run rls:check` | ✅ 120/0 | ✅ 120/0 | — |
| `npm run typecheck` | ✅ | ✅ | — |
| `npm run lint` | ✅ 0 erros / 3 avisos | ✅ 0 erros / 3 avisos | — |
| `node scripts/migration-check.mjs` | ✅ 13/13 | ✅ 13/13 | — |
| `python3 verify-integrity.py` | ✅ PASS (0 falhas, 1 aviso) | ✅ PASS (0 falhas, **1 aviso**) | aviso = packs `pack_les_*` legados, pré-existente |
| `python3 prd-score.py` | 92.6% | **92.6%** | limiar 80% |

**A suíte de contrato encolheu de 68 para 32 testes e o gate ficou mais forte** — não é paradoxo, é
a medição desmontada. Dos 68, saíram **37** e entrou **1**. Os 37 se decompõem assim:

- **14** eram segunda cópia: `schemas.spec.ts` rodava os mesmos 13 casos contra **os dois** documentos
  (13 × 2 = 26) e mais uma guarda de drift — a cópia redundante (13) mais a guarda (1) = 14;
- **22** eram asserções que o gate já cobria **nos mesmos termos**: `openapi.spec.ts` (1 teste — 8
  `toContain` de path, subconjunto dos mesmos 10 paths) mais 21 das 22 de `endpoints.spec.ts` — as 20
  de path × método (o gate as verifica nos dois sentidos, método por método) e o `404` em `GET` (regra
  `404`, R6/ADR-038);
- **1** asserção não existia em lugar nenhum: *todo 4xx/5xx do canônico referencia `Problem`*. É a
  vigésima segunda de `endpoints.spec.ts`; ela não foi apagada — foi para o gate como **N-18**, o único
  teste do repositório que falha se uma resposta de erro deixar de referenciar `Problem`.

---

## 5. Controles negativos executados (R7)

| # | Mutação / medição | Resultado medido |
|---|---|---|
| **N-18** (novo) | `$ref` de um 404 trocado para `ErrorResponse` (media type legal, `$ref` resolvível — só a regra nova pode falhar) | `exit 1` com `FAIL: Problem` ✅ |
| positivo do gate | execução real contra o spec real | `exit 0`, 14/14 respostas de erro referencia `Problem` ✅ |
| gate retirado | `npm run contract:check` | `npm error` (o script não existe) ✅ |
| CI (rename de id de job) | `yaml.safe_load` do workflow + resolução de todo `needs:` | 15 jobs, **0** `needs` não resolvidos ✅ |
| leitor do arquivo removido | `grep` por leitura (`readFileSync|require|from`) do caminho | **nenhum** leitor em código ✅ |
| guarda de drift | havia divergência entre os dois documentos quando ela foi removida? | **não** — estava verde (27/27) na medição imediatamente anterior à edição; a remoção não escondeu drift pendente ✅ |
| idem — o que a substitui | o pin D6 aponta para as **fontes** (`specs/*.md`), não para o outro documento | controle negativo real do pin já executado em A2 (byte em `listening-corpus-spec.md` → `FAIL: pin`) |
| parse do arquivo com o aviso | `yaml.safe_load` depois do cabeçalho de depreciação | `openapi 3.1.0`, 10 paths, 14 schemas ✅ |
| tabela do CHANGELOG | contagem de células das linhas da seção *Removed* | 3 células em 5/5 linhas ✅ |
| **número do cabeçalho do aviso** (`3f465f8`) | "9 of its 14 schemas" — é reprodutível hoje? | **não** ⚠️ — medido contra o canônico: **13** dos 14 diferem, **1** é idêntico (`PackOption`), nenhum falta no canônico, e o canônico só acrescenta `Problem`. Nenhum critério testado (byte, `required`, chaves de `properties`, alcançabilidade pelos paths) devolve 9 |
| tabela do CHANGELOG | contagem de células das linhas da seção *Removed* | 3 células em 5/5 linhas ✅ |

O último item é um número que **não** se confirma. A frase "9 of its 14 schemas" é do cabeçalho que
C4 escreveu no arquivo, e o arquivo não existe mais — ela sobrevive só na mensagem de commit, que não
se reescreve (R8). A medição contra o canônico dá **13 de 14 divergentes e 1 idêntico**; o "9" está
registrado aqui como imprecisão de um artefato histórico, não como fato do contrato. Nada em A3
depende dele: o que a remoção precisava dizer (qual é o contrato, onde está a migration path) está
dito corretamente no cabeçalho e no `CHANGELOG.md`.

---

## 6. Desvios registrados

1. **`spectral` não adotado localmente** (herdado de A2, §10 daquele relatório): o gate resolve
   `$ref` por si; o job `contract-test` do CI segue rodando `spectral` sobre o canônico. D5.1 tem
   precedência sobre a redação literal de D5.
2. **D3 executado por intenção, não literalmente**: "repontar os cinco leitores" — dois já estavam
   repontados por A2, dois foram **retirados** (D5.1) e um foi **substituído** pela regra do gate.
   Registrado no adendo pós-aceitação do ADR-040.
3. **§4.4 não governa o arquivo** (§2.6): o aviso não segue a janela de 90/180 dias porque nenhuma
   linha da §4.4 rege um artefato de repositório. Escrito no arquivo, no CHANGELOG e aqui — se a sua
   leitura for outra, é decisão sua (§8.4).
4. **Os 80 artefatos compilados fora do contrato não foram removidos** (classe diferente, R8); a
   medição e o argumento estão em §2.2.

---

## 7. Onde cada obrigação do contrato mora agora

Uma obrigação, um lugar — a lista fechada, para que a próxima sessão não a re-derive de `grep`:

| obrigação | dono único |
|---|---|
| o canônico parseia como YAML puro / existe | `scripts/contract-gate.mjs` (regra `spec`/`parse`, N-1, N-11) |
| `components.schemas` não vazio, `paths` não vazio | gate (N-4) |
| todo `$ref` resolve | gate |
| `servers` termina em `/api/v1` (§4.4) | gate (N-5) |
| `Problem` existe e tem os membros RFC 9457 | gate (N-7) |
| **todo 4xx/5xx referencia `Problem`** | **gate (novo, `685ea4f`)**; N-18 |
| media type dos erros é `application/problem+json` | gate |
| `GET` com parâmetro declara `404` (R6) | gate |
| spec × rotas, método por método, nas duas direções | gate (N-2, N-3, N-4) |
| `Deprecation` não-booleano (§4.4 v2.2.0) | gate (N-10) |
| versão em path, não em header | gate (N-17) |
| pin contra as **fontes** (`specs/*.md`, D6) | gate |
| instância real × schema (os payloads que o serviço devolve) | `tests/contract/schemas.spec.ts` (13 casos) |
| registro da mudança que quebra, com caminho de migração | `CHANGELOG.md` (§4.4, *Changelog*) |
| que o contrato mude de forma ordenada | `docs/adr/040` (o plano) + este relatório |

---

## 8. Pendências humanas e bloqueios

### 8.1 H-1/H-2/H-3 — continuam `Proposed`

ADRs 041 (**H1** — escopo de escrita no catálogo), 042 (**H2** — direito à eliminação LGPD × log
append-only imutável) e 043 (**H3** — exposição de θ, política de CORS e publicação de SDK) — **não
ratificados**; nada em A3 depende deles. Continuam com `deciders: [unassigned]`, e continuam assim de
propósito.

**Atualização:** ADR-040 saiu de `Proposed` — mas por **D3 fechado** (era o seu último item aberto),
não por ratificação de conteúdo; a distinção está no `## Status` dele e no `README.md` dos ADRs.

### 8.2 D-3 (`/auth/refresh`) — sem bloqueio constitucional, adiada

Confirmado no adendo de A2: a §4.5 põe `/auth/refresh` **fora do MVP**; o que resta é a remoção
efetiva, que é **A5** (junto com RLS/`PgSessionContext`, 404-não-403 e DTOs). A3 não a toca — a fase
é de contrato, e `src/` não foi tocado.

### 8.3 O portão de aposentadoria segue sem instrumento

`iac/kong/kong.yml` não tem plugin de log/métricas/correlação. Consequência prática para a §4.4
v2.2.0: **depreciação pode ser anunciada, não aposentada por evidência** (ADR-033 D4). Nada em A3
depende disso — o aviso que A3 escreveu é informativo, não um header HTTP — mas enquanto o
instrumento faltar, qualquer aposentadoria real é fé, não medição.

### 8.4 Uma decisão que é sua, criada por A3

A leitura de §2.6 (a §4.4 não rege um artefato de repositório; logo, sem janela de 90 dias). A3
executou a leitura "o artefato não é recurso". Se você quiser o contrário — todo artefato de
repositório com valor de contrato segue a janela —, o procedimento é uma emenda de §4.4 como a de
H-1, e o custo é que a remoção de um arquivo passaria a exigir 90 dias de existência anunciada.

### 8.5 UNVERIFIED que A3 **não** resolve (não usar número inventado)

Herança de A2 §8.3, intacta: TTL de idempotência, `max-age`/ETag de coleção, `limit` default/máximo e
TTL do cursor, `Retry-After` por camada, validade de `links.result`, prazo de eliminação LGPD,
"<30 dias" (`BACKLOG.md`), "48h/72h". São de A7.

---

## 9. O que NÃO foi feito e por quê

- **Os 80 artefatos compilados fora do contrato** (§2.2): mesma classe, superfície diferente. Removê-los
  é um `git rm` largo e verificável (nada os coleta, nada os importa), e é o tipo de mudança que quer
  um commit próprio, não uma carona em A3.
- **Nenhuma reescrita de registro datado** (§2.7): 6 ADRs, 3 relatórios e 3 linhas de histórico
  nomeiam o arquivo removido de propósito.
- **Nada de `src/`**: BOLA, RLS inalcançável, `items[].key` servido, `/auth/refresh` mock, 8 de 12
  rotas mock — todos continuam. A3 é a fase do **contrato**, e A0 mediu cada um desses com dono
  próprio (A5/A6).
- **A suspeita de bug de caminho no `prd-score.py`** (citada no relatório A2: "C3 em 62,9%" e 26
  §-refs `(file unreadable)`): **não investigada nesta fase**. Não bloqueia (`92.6% ≥ 80.0%`, medido
  hoje), e investigá-la é diagnóstico de ferramenta, não contrato. Fica registrada.

---

## Apêndice — evidência crua

```bash
# 1. Leitores do documento obsoleto, no início de A3 (medido, não herdado do ADR)
grep -rn 'api/openapi.yaml' --include='*.ts' --include='*.mjs' --include='*.py' .
# → contract-check.mjs:5, scripts/contract-check-full.mjs:6, tests/contract/schemas.spec.ts:250
#   (openapi.spec.ts:6 e endpoints.spec.ts:12 — já repontados em A2)
#   scripts/kong-config-check.mjs:53 → só comentário, no passado

# 2. Contagem por arquivo, antes → depois (stash só do arquivo editado)
openapi 1 → 1 (removido em C2)   endpoints 22 → 22 (removido em C2)
schemas 27 → 13                  gate 18 → 19 (N-18)
# total da suíte de contrato: 68 → 32

# 3. Censo das respostas de erro do canônico (antes de escrever a regra `Problem`)
python3 - <<'PY'
import yaml
d = yaml.safe_load(open('docs/api-spec.openapi.yaml'))
n = 0; ok = 0; ctm = 0
for p, item in d['paths'].items():
    for m, op in item.items():
        if m not in ('get','post','put','patch','delete','head','options'): continue
        for code, r in (op.get('responses') or {}).items():
            if str(code).startswith(('4','5')):
                n += 1
                ok  += ((r.get('content') or {}).get('application/problem+json', {}).get('schema') or {}).get('$ref') == '#/components/schemas/Problem'
                ctm += list((r.get('content') or {}).keys()) == ['application/problem+json']
print(n, ok, ctm)
PY
# → 14 14 14   (respostas 4xx/5xx; com $ref Problem; com media-type problem+json)
#   `ErrorResponse` segue no arquivo (depreciado) → é o alvo do controle negativo N-18

# 4. Artefatos compilados rastreados
git ls-files | grep -E '\.spec\.(js|js\.map|d\.ts|d\.ts\.map)$' | sed 's|/[^/]*$||' | sort | uniq -c
# no início de A3 →  12 tests/contract · 32 tests/domain/services · 32 tests/integration · 16 tests/unit{,/audio,/audit,/content}  = 92
# hoje (depois de C1/C2) → as mesmas 80 fora de tests/contract; a linha de tests/contract desapareceu
git ls-files | grep -cE '\.spec\.(js|js\.map|d\.ts|d\.ts\.map)$'   # → 80

# 5. O CI depois do rename do job (medido, porque um id de job errado quebra em silêncio)
python3 - <<'PY'
import yaml; d=yaml.safe_load(open('.github/workflows/ci.yml')); ids=set(d['jobs'])
print(len(ids), sum(1 for j in d['jobs'].values() for n in (j.get('needs') or []) if n not in ids))
PY
# → 15 jobs, 0 needs não resolvidos

# 6. Nada mais lê o arquivo removido
grep -rn "readFileSync(.*openapi|require(.*openapi|from '.*openapi" --include='*.ts' --include='*.mjs' .
# → (nenhum leitor em código)

# 7. O arquivo com o aviso de depreciação, no commit em que ele existia (C4 = 3f465f8)
#    (na raiz do repo git é preciso o prefixo its-platform/; o arquivo NÃO existe mais em disco)
git show 3f465f8:its-platform/docs/api/openapi.yaml > /tmp/removed.yaml
python3 -c "import yaml;d=yaml.safe_load(open('/tmp/removed.yaml'));print(d['openapi'],len(d['paths']),len(d['components']['schemas']))"
# → 3.1.0 10 14      (o canônico vivo tem 15: os mesmos 14 nomes + `Problem`;
#                     medido: 13 dos 14 divergem, 1 é idêntico — ver §5)
test -e docs/api/openapi.yaml || echo 'removido em 1d0e4f8'

# 8. Gates finais (cwd = its-platform/)
npm run test:gate            # ver §4
npm run contract:gate        # PASS
npm run kong:check           # PASS
npm run domain:check         # 23 arquivos, 0 violações
npm run rls:check            # 120 arquivos, 0 violações
npm run typecheck            # OK
npm run lint                 # 0 erros, 3 avisos
node scripts/migration-check.mjs   # 13/13
cd .. && python3 verify-integrity.py   # PASS — 0 falhas, 1 aviso
python3 prd-score.py                   # 92.6% ≥ 80%
```
