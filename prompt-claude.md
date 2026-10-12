# MISSÃO: corrigir e blindar documentos, verificadores e agentes do ITS Platform

## 1. Papel e contexto
Você é engenheiro de qualidade do repositório Curso-de-Ingles (conteúdo + its-platform em NestJS/TypeScript).
Uma auditoria externa leu os documentos e scripts (NÃO o repositório inteiro) e listou os defeitos abaixo.
Seu trabalho, nesta ordem: (1) CONFIRMAR cada defeito contra o repositório, (2) CORRIGIR só os confirmados,
(3) INSTALAR mecanismos para que a classe de defeito não volte.

## 2. Regras invioláveis
R1 Confirmar antes de corrigir. Para cada ID, rode grep/comando que prove e registre
   CONFIRMADO / PARCIAL / NÃO CONFIRMADO com a evidência. Não corrija o que não confirmar.
R2 Derivação sobre asserção (CONSTITUTION §2). Todo número que você escrever cita o comando ou o §
   que o produz. Se não conseguir derivar, escreva UNVERIFIED e liste em pendências humanas. Nunca invente.
R3 DONE só com evidência: comando + saída resumida + data. Nada é DONE porque você acha que está.
R4 Todo gate novo ou alterado exige CONTROLE NEGATIVO: injete o defeito numa cópia/fixture, mostre o gate
   falhando, reverta, mostre passando. Gate que nunca falhou não conta.
R5 Fail-closed: zero itens verificados = FALHA, nunca ok. Arquivo ausente = FALHA, nunca string vazia.
R6 Edições mínimas (str_replace/diff). Não reescreva arquivos inteiros nem reformate. Exceções
   autorizadas: MEMORY.md (F3) e os arquivos de .opencode/agents (F6).
R7 Uma mudança, uma classe de artefato (SDD §6). Um commit por classe, mensagem convencional com o ID do defeito.
R8 Mudança em regra do SDD, em check do verify-integrity.py ou em vocabulário de status segue o SDD §9:
   diff + defeito com arquivo/§ + o que o gate passa a não pegar + changelog + verify-integrity antes/depois.
R9 Decisões humanas (SDD §8, escolha de revisor independente, ratificação do CONSTITUTION §9, pedidos de
   licença): NÃO decida. Registre evidência e prepare o pedido.
R10 Números legais (LGPD/ANPD) e versões de software: não troque um número por outro de memória.
    Busque a fonte primária (context7/firecrawl), cite URL e data de acesso, marque needs_human_review.
R11 Não altere src/ (código de produto) nesta missão, exceto os itens explícitos da F7.
R12 Proibido aceitar baseline vermelho esperado. Falhas conhecidas entram numa allowlist POR ID de check
    e o gate falha se o conjunto mudar em qualquer direção.

## 3. Como trabalhar (contexto limitado)
- Execute UMA fase por sessão (F0…F8). Leia por grep ou view com faixa de linhas; as células do BACKLOG são enormes.
- Ao fim de cada fase: rode todos os gates (verify-integrity.py, prd-score.py, verify-release-gates.py,
  npm run typecheck/domain:check/test), faça commit(s), escreva reports/fase-N.md e PARE.
  Só continue quando eu escrever continuar.
- Ao iniciar uma sessão: leia apenas o último reports/fase-*.md e os arquivos da fase atual.

## 4. Fases e defeitos

### F0 — Baseline e confirmação
- Crie a branch fix/auditoria. Rode todos os gates e salve as saídas em reports/baseline/.
- Rode um comando de confirmação para CADA ID abaixo e preencha reports/confirmacao.md.
- Liste os arquivos que existem de fato (BACKLOG.md, MEMORY.md, ITS-ARCHITECTURE.md, SDD.md, PRD.md,
  AGENTS.md, CONSTITUTION.md, .opencode/agents/*, its-platform/docs/adr/*) e onde cada um mora.

### F1 — Verificadores (tudo depende deles; faça antes dos documentos)
prd-score.py
- P1 Gate de licença não é gate: C1 vale 14 pts e os demais somam 86; a mensagem LICENCE GATE FAILED não
  altera o exit code. Faça C1=0 retornar exit 1 e corrija o docstring (não passa de 80) para a realidade.
- P2 C2(d): reintroduzir KNOWN_FALSE só imprime nota (got += 0.0). Faça deduzir pontos.
- P3 truth[practice_items] é calculado e nunca comparado (CANON não o inclui). Inclua e compare.
- P4 Docstring diz nada hardcoded mas KNOWN_FALSE/DECISIONS são hardcoded; diz PRD antigo ~20% enquanto
  o PRD cita 13,5%. Derive o número rodando contra a cópia antiga (se existir) ou remova a afirmação.
- P5 Adicione checks aritméticos: toda partição declarada soma o total (ex.: reuse basis 93+13+48 vs 123
  lições) e todo N de M cita derivação.
- P6 rglob(*.md) varre o repo inteiro (node_modules?). Exclua node_modules/.git/dist.
verify-integrity.py
- I1 [10], [12], [13] varrem só DOCS (16 arquivos) + ARTIFACTS (les_*, pack-les-*). Estenda para as packs
  pack_les_*_v1.md e para PRD.md, BACKLOG.md, ITS-ARCHITECTURE.md, MEMORY.md, AGENTS.md (onde existirem).
- I2 Passes vazios: [12] com 0 tabelas e [13] com 0 blocos imprimem ok. Passe a FALHAR. [13] ignora em
  silêncio blocos JSON que não parseiam: passe a avisar/falhar.
- I3 [5c] compara status == shipped e [5c-ii] usa startswith(shipped): unifique. Nível inferido: todo
  dialogo que não é _a1_/_a2_ vira B1: prefixo desconhecido deve falhar.
- I4 Dois parsers para a chave de slot (verificador conta ✓ em qualquer lugar; o loader lia uma coluna).
  Defina UMA gramática de chave e faça verificador e loader usarem o mesmo módulo/regra.
- I5 Aviso permanente de packs legadas: transforme em CATRACA (baseline versionado; falha se subir).
- I6 AGENTS.md diz 14 checks; main() chama 13. Derive o número do código (não digite).
- I7 Escopo declarado no SDD §10 (matriz de cobertura) deve ser GERADO do código, não escrito à mão.
release-gates
- I8 Substituir 12 falhas esperadas, não consertar por allowlist por ID de check (R12).
Controle negativo (R4) para cada item P*/I*.

### F2 — BACKLOG.md (its-platform/BACKLOG.md) e PRD.md
Confirme e corrija:
- B1 Soma de P3: as estimativas dão 83d, o texto diz 70d. Recalcule TODOS os totais (P0..P3, MVP, grand
  total) por script e escreva só os valores calculados.
- B2 P0: texto 16d, resumo 14d/10 histórias, tabela com 12 linhas somando 17d. ID P0.8 duplicado
  (CI hardening e OpenTelemetry): renumere e atualize todas as referências.
- B3 P3.9 e P3.14 são a mesma obra (TD-001, 20d) contada duas vezes e com prioridades contraditórias
  (Must vs Should; bloqueia gate vs não bloqueia). Unifique em uma história.
- B4 Tabelas quebradas: blockquote no meio da tabela P2; cabeçalho duplicado em Bugs; célula extra em P0.5.
- B5 Referências erradas: PRD §9 risk RF-002 (RF-xxx está no §8; blockers no §7; marcos no §9).
- B6 Histórias ausentes (D2 repetido): RF-003 (renderizar 30 clipes), RF-004 (pedido de permissão),
  RF-005 (piloto com aprendizes), RF-006 (revisão ELT), RF-008 (P0 de licença da pack a2-greetings-intro).
  Crie as histórias com flag human-only e dono real (veja M3). Itens de longo prazo vão para o início.
- B7 Caminho crítico omite P1.3/ADR-021 (seletor, NOT DONE) e não reflete o Pilot A (<50 usuários).
  Proponha um corte Pilot A explícito e marque o restante como pós-piloto; NÃO apague histórias.
- B8 PRD ainda diz piloto de 10 itens e 0 parâmetros/piloto não construído; P1.8 diz 12 itens e DONE.
  Emende o PRD pelo SDD §9 nomeando o número retratado. Se os parâmetros forem ancorados por especialistas,
  escreva isso nos dois documentos.
- B9 Contagens: 855 (PRD), 847 (P1.12), 921 (content-check). Derive e documente a relação por comando.
- B10 PRD §2: reuse basis 93+13+48=154 ≠ 123 lições. Derive a partição real de curriculum-graph-spec §4.3 e
  external-sources.md; se não for derivável, UNVERIFIED + pendência humana.
- B11 Células com histórico/post-mortem (P1.12, P2.2, P0.5...): mova a narrativa para ADR/CHANGELOG e deixe
  a linha com status + link. Não perca nenhuma informação (mova, não apague).
- B12 Critério de saída r ≥ 0,7 com pós-teste (ARCH M4) não tem história nem dados: crie a história ou remova.

### F3 — MEMORY.md
- M1 Afirma DONE para P0.5/0.6/0.7/0.8 e P1.3 que o BACKLOG reabriu/corrigiu; aponta o CI para
  its-platform/.github/workflows/ci.yml (o GitHub só lê <raiz>/.github/workflows/); diz no-op gates extintos.
- M2 Decisão durável nº 6 (PGlite nunca prova RLS) foi refutada pela ADR-026. Índice diz 9 itens; há 8.
  §3.2 lista D1/D2 como não corrigidos; §1 diz que foram. Numeração duplicada em §7.
- M3 Pendências com donos inexistentes (Tech Lead, DBA, Devops, Backend Lead): reatribua a papéis reais
  (usuário ou agente nomeado) ou marque sem dono.
- M4 Plano fora do repo (/home/dalmo/.opencode/plan/pilot-a.md): copie para docs/plans/pilot-a.md no repo
  (versionado) e aponte para ele.
- Reescrita autorizada: reduza o MEMORY.md a ponteiros + um bloco de status GERADO (ver F8). Status manual proibido.

### F4 — ITS-ARCHITECTURE.md
- A1 Descreve FastAPI/Celery/NetworkX/Pydantic/SQLAlchemy (superado pela ADR-012), submódulo (.gitmodules
  nunca existiu), JWT com refresh/PKCE (ADR-013 exclui), ERD separando LISTENING_ITEM (decisão durável nº 3).
- A2 §10 reintroduz colisão de IDs M1–M7 com os marcos do PRD (M0–M6).
- Ação: banner SUPERSEDED no topo listando seções superadas e o ADR que as substitui; rebaixe-o na tabela de
  precedência do SDD (nível histórico). Não reescreva o corpo. Remova-o da lista de leitura obrigatória.

### F5 — SDD.md e AGENTS.md (emendas pelo SDD §9)
- S1 SDD cobre só artefatos de conteúdo. Adicione classe artefato de plataforma (migration, loader, workflow
  de CI, gate) cujo gate exige controle negativo.
- S2 Precedência (§0) omite CONSTITUTION, ADRs, BACKLOG, ARCHITECTURE, MEMORY: inclua com rank.
- S3 7 specs (SDD) vs six specs (ADR-018/ERD/BACKLOG): derive por ls e padronize.
- S4 Flow 1 renomeia item_id para pack_les_<lesson>_v1.<skill>.<nn> (ainda com pontos), contra o RF-001/§1.2:
  confirme em assessment-item-spec §1.2 e corrija o fluxo.
- S5 Cabeçalho Version 1.0 vs changelog 1.1; fluxos com IDs/contagens reais que envelhecem (use placeholders).
- G1 AGENTS.md (rank 2): ≥80% mastery contradiz o gate do PRD/ADR-018 (P≥0,85 + IC + evidência) e, pela
  precedência atual, tem mais autoridade; SM-2 or FSRS (a decisão é FSRS); content-only/no build é falso;
  árvore de diretórios desatualizada. Emende e alinhe.

### F6 — Agentes (.opencode/agents/*.md)
- AG1 software-engineer, api-developer, devops-engineer, security-engineer descrevem FastAPI/Pydantic/
  SQLAlchemy/Celery/pytest/ruff/mypy/bandit/pip-audit (stack removida na P0.9). Reescreva enxuto:
  princípios + ponteiros para CONSTITUTION e ADRs, SEM duplicar stack nem decisões.
- AG2 database-engineer: prescreve policy current_setting(...)::uuid sem missing_ok/nullif (causa do B-001) e
  PGlite não prova nada (refutado pela ADR-026); triggers adiados para P0.4 (feito). Aponte para ADR-019/026/029.
- AG3 security-engineer contradiz ADR-013 (resource server: sem refresh próprio, sem senhas); DPO, pen test e red
  team externos anuais fora de escala do piloto; prazos LGPD sem fonte (R10).
- AG4 system-architect: ADRs em .opencode/docs/adr/ (reais: its-platform/docs/adr/); lista ITS-ARCHITECTURE.md
  como obrigatório; 7 specs.
- AG5 api-developer cita RFC 7807 (P1.17 migra para RFC 9457). devops: dimensione ao piloto (ADR-008/P2.5),
  versões datadas: confirmar por fonte primária (R10).
- AG6 Limiares de cobertura divergem (90/80, 80, 95/90/80). Fonte única: CONSTITUTION §4.8; agentes só apontam.
- AG7 Todos usam o mesmo modelo; revisão por outro agente não é independente. NÃO decida: registre como
  pendência humana e proponha 2 opções.
- Check novo: scripts/verify-agents.py — falha se .opencode/agents/*.md contiver termos banidos
  (fastapi, pydantic, sqlalchemy, alembic, pytest, ruff, mypy, pip-audit, bandit, 7807) ou paths inexistentes.
  Lista de termos banidos derivada das ADRs Superseded. Controle negativo obrigatório.

### F7 — Código/CI (somente estes itens; sem refatorar produto)
- C1 Faça tsc -p tsconfig.test.json compilar e virar gate de CI (raiz do B-002).
- C2 Escreva ADR propondo FORCE ROW LEVEL SECURITY (alternativas, riscos) e NÃO ative sem aprovação.
- C3 Garanta que as suítes de loader rodem em PostgreSQL real no CI ou documente por que não.
- Fora de escopo: ADR-021/P1.3 (apenas confirme que está no caminho crítico do BACKLOG).

### F8 — Prevenção (o que impede a volta)
- V1 scripts/verify-backlog.py: soma de esforço por fase e total; IDs únicos; Depends existem e sem ciclo;
  referências PRD §n/ADR-nnn resolvem; tabelas bem formadas; toda linha DONE tem linha de evidência
  (comando, data); histórias human-only têm dono. Rode no CI e no pre-commit.
- V2 facts.yaml (fonte única de contagens: lições, módulos, packs, itens, slots) GERADO por script a partir do
  repo. verify-integrity compara PRD, BACKLOG, MEMORY, ARCHITECTURE, AGENTS contra ele.
- V3 scripts/gen-status.py: gera status.json/bloco de status a partir dos resultados dos gates. Status manual
  em MEMORY/BACKLOG passa a ser proibido; DONE só aparece se o CI o produzir.
- V4 Agentes não se auto-aprovam: a coluna de status passa a ter claimed (agente) → verified (CI). Atualize DoD.
- V5 CI job docs-integrity roda todos os verificadores, fail-closed. Cada verificador tem teste de controle negativo
  em tests/verifiers/ (fixture com defeito injetado deve falhar).
- V6 Atualize a AGENTS.md/CONSTITUTION com as regras R1–R12 (como processo, via SDD §9).

## 5. Formato de reports/fase-N.md
1. IDs tratados e veredito (CONFIRMADO/PARCIAL/NÃO CONFIRMADO)
2. Arquivos alterados (diff resumido) e commits
3. Saída ANTES/DEPOIS de cada gate (trecho relevante)
4. Controles negativos executados (defeito injetado → falha observada → revertido)
5. Pendências humanas (UNVERIFIED, needs_human_review, decisões SDD §8)
6. O que NÃO foi feito e por quê

## 6. Critérios de aceite da missão
- Todos os gates verdes sem baseline vermelho; allowlist por ID, se existir, está justificada.
- Zero número sem derivação nos documentos tocados; totais do BACKLOG batem com o script.
- Nenhum agente menciona termos banidos; verify-agents passa e falha no controle negativo.
- Cada ID da seção 4 está com veredito e, se confirmado, com commit e evidência.
- Nenhuma decisão humana foi tomada por você.

Comece agora pela F0. Não avance para a F1 antes do meu continuar.
