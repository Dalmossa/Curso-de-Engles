
# Plano: Interface Web do ITS Platform (Next.js + React + PWA)

## 1. Visão Geral
- **Objetivo:** Criar interface web completa do ITS (Intelligent Tutoring System) para ensino de inglês a falantes de português do Brasil.
- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, PWA.
- **Integração:** Consumo da API REST existente em `its-platform/src/` (NestJS), seguindo `docs/api-spec.openapi.yaml`.
- **Mobile:** PWA (Progressive Web App) com suporte offline para lições e prática de pronúncia.
- **Testes:** Vitest + React Testing Library + Playwright (E2E).
- **Deploy:** Docker + Kubernetes/ArgoCD (devops-engineer).

---

## 2. Princípios de Engenharia de Software

### 2.1 Programação Orientada a Objetos (OOP)
Toda a camada de domínio e aplicação segue OOP com:
- **Encapsulamento**: Entidades e Value Objects expõem apenas o necessário; estado interno privado.
- **Herança**: Usada com moderação, preferindo composição para componentes React e estratégias de domínio.
- **Polimorfismo**: Interfaces de repositório e estratégias de recomendação permitem múltiplas implementações.
- **Abstração**: Camadas se comunicam por interfaces (TypeScript `interface`/`type`), não por implementações concretas.

### 2.2 Princípios SOLID

| Princípio | Aplicação no Frontend |
|-----------|----------------------|
| **S** - Single Responsibility | Cada componente React tem uma responsabilidade (ex: `PronunciationPlayer` só reproduz áudio). Cada caso de uso faz uma ação (ex: `SubmitPracticeUseCase` só submeta prática). |
| **O** - Open/Closed | Novos tipos de exercício (multiple choice, true/false, listening) são adicionados por extensão, não modificação de código existente. |
| **L** - Liskov Substitution | Mocks de repositórios e clientes de API são substituíveis pelas implementações reais em testes sem quebrar contratos. |
| **I** - Interface Segregation | Interfaces pequenas e específicas: `ILessonRepository`, `IMasteryRepository`, `IAuthService` — não interfaces grandes genéricas. |
| **D** - Dependency Inversion | Camadas de aplicação dependem de abstrações (interfaces), não de concretos. Injeção de dependência via Context do React ou container leve. |

### 2.3 Clean Code
- Nomes intencionais: `submitPracticeAnswers`, `calculateMasteryGate`, `isLessonUnlocked`.
- Funções pequenas (< 20 linhas), com um único propósito.
- Não há mágicos números ou strings; tudo em `shared/constants.ts`.
- Comentários apenas para o "porquê", nunca para o "o quê" (código autoexplicativo).
- Formatação consistente com Prettier + ESLint.

### 2.4 Clean Architecture (Camadas)
```
frontend/src/
├── core/               # Domínio: entidades, value objects, regras de negócio (sem dependências externas)
├── application/        # Casos de uso, orquestração (depende apenas do core)
├── infrastructure/     # Implementações externas: API clients, storage, audio players
├── presentation/       # Componentes React, UI, estado local (depende de application e core)
└── shared/             # Utilitários, tipos globais, constantes
```
**Regra de dependência:** `presentation` → `application` → `core`. `infrastructure` é implementação de interfaces definidas em `core` ou `application`.

---

## 3. Estrutura de Pastas (Estrutura Completa)

```
its-platform/
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── (auth)/          # Login, cadastro, recuperação
│   │   │   ├── (dashboard)/     # Painel do aluno
│   │   │   │   ├── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (lessons)/       # Lições de inglês
│   │   │   │   ├── [lesson_id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── practice/
│   │   │   │   └── layout.tsx
│   │   │   ├── (diagnostic)/    # Teste de posicionamento
│   │   │   │   └── page.tsx
│   │   │   ├── (mastery)/       # Visão de domínio por skill
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx       # Root layout com providers
│   │   ├── core/                # Camada de domínio (Clean Architecture)
│   │   │   ├── entities/        # Learner, Mastery, Lesson, Pack, Item
│   │   │   ├── value-objects/   # CEFRLevel, Theta, SkillId, ItemId
│   │   │   ├── repositories/    # Interfaces de repositório (ILessonRepository, etc.)
│   │   │   ├── services/        # Domain services (MasteryGateService, etc.)
│   │   │   └── events/          # Domain events
│   │   ├── application/         # Casos de uso
│   │   │   ├── startDiagnostic.ts
│   │   │   ├── submitPractice.ts
│   │   │   └── getNextActivity.ts
│   │   ├── infrastructure/      # Adaptadores externos
│   │   │   ├── api/             # Clients da API REST (generated from OpenAPI)
│   │   │   ├── storage/         # localStorage, IndexedDB (offline)
│   │   │   └── audio/           # AudioUrlSigner client, Howler wrapper
│   │   ├── presentation/        # Componentes React
│   │   │   ├── components/      # Atomos/moléculas (Button, Input, Card)
│   │   │   ├── forms/           # Formulários de prática, diagnóstico
│   │   │   ├── charts/          # Recharts (mastery, progresso)
│   │   │   ├── audio/           # Player de áudio, gravação de pronúncia
│   │   │   └── layout/          # Sidebar, Navbar, Footer
│   │   ├── shared/              # Utilitários, constantes, tipos
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── utils.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/                 # Playwright
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile
├── its-platform/                # Backend existente (NestJS)
│   ├── src/
│   ├── docs/api-spec.openapi.yaml
│   └── ...
└── docs/
    └── frontend-architecture.md
```

---

## 4. Mapa de Tarefas (Ordem de Execução)

### Fase 1: Setup e Infraestrutura
- [ ] Criar projeto Next.js + TypeScript + Tailwind
- [ ] Configurar PWA (next-pwa, manifest.json, service worker)
- [ ] Configurar ESLint + Prettier + Husky
- [ ] Configurar Vitest + React Testing Library
- [ ] Configurar Playwright para E2E
- [ ] Gerar tipos TypeScript a partir de `docs/api-spec.openapi.yaml` (`openapi-typescript`)
- [ ] Criar `frontend/Dockerfile` e configurar CI/CD

### Fase 2: Camada de Domínio e Aplicação (Clean Architecture)
- [ ] Definir entidades (Learner, Mastery, Lesson, Pack, Item) — OOP + encapsulamento
- [ ] Definir value objects (CEFRLevel, SkillId, Theta, ItemId) — imutáveis, validação no construtor
- [ ] Definir interfaces de repositório (ILessonRepository, IMasteryRepository, etc.) — Interface Segregation
- [ ] Implementar domain services (MasteryGateService, NextActivitySelector) — regras de negócio puras
- [ ] Implementar casos de uso: startDiagnostic, submitPractice, getNextActivity — Single Responsibility
- [ ] Implementar clientes de API REST (TanStack Query + fetch/axios) — Dependency Inversion

### Fase 3: Interface do Usuário
- [ ] Layout raiz (Navbar, Sidebar, Footer) — componentes acessíveis (Radix UI)
- [ ] Página de login/cadastro (integração com Auth do NestJS)
- [ ] Página de diagnóstico (questões, placamento CEFR)
- [ ] Página de lição (conteúdo, navegação, áudio)
- [ ] Página de prática (formulários de resposta, feedback imediato)
- [ ] Página de progresso/mastery (gráficos Recharts)
- [ ] Componentes de áudio (player, gravação de pronúncia)
- [ ] Offline support (PWA cache para lições e áudio)

### Fase 4: Testes e Qualidade
- [ ] Testes de unidade (Vitest + RTL) — componentes, hooks, casos de uso
- [ ] Testes de integração — fluxos de diagnóstico e prática
- [ ] Testes E2E (Playwright) — diagnóstico → lição → prática → progresso
- [ ] Auditoria de acessibilidade (axe-core)
- [ ] Teste de PWA (offline, instalação, Lighthouse)

### Fase 5: Deploy
- [ ] Build de produção Next.js
- [ ] Docker build multi-stage
- [ ] Helm chart para Kubernetes (se usar K8s)
- [ ] ArgoCD Application manifest
- [ ] Variáveis de ambiente de produção

---

## 5. Riscos e Mitigações

| Risco | Solução Proposta |
|-------|------------------|
| Inconsistência entre contratos da API e frontend | Usar `contract-testing` + gerar tipos TypeScript a partir do OpenAPI (`openapi-typescript`) |
| Estado de progresso do aluno desincronizado | TanStack Query com cache invalidation após ações de prática/mastery |
| Áudio não carrega (CORS/autenticação) | Usar `HmacAudioUrlSigner` do backend para URLs assinadas; configurar CORS no NestJS |
| Acessibilidade (a11y) | Usar Radix UI/Headless UI + testes com axe-core |
| Progresso perdido ao recarregar página | Persistir estado crítico em IndexedDB + sincronizar com backend via TanStack Query |
| Deploy da interface separada do backend | Docker multi-stage + Helm chart para Kubernetes |
| Performance em lições com muito conteúdo | Code splitting + lazy loading de componentes de lição |

---

## 6. Estrutura de Pastas Detalhada

```
frontend/src/
├── app/                 # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── (lessons)/
│   │   ├── [lesson_id]/
│   │   │   ├── page.tsx
│   │   │   └── practice/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── (diagnostic)/
│   │   └── page.tsx
│   ├── (mastery)/
│   │   └── page.tsx
│   └── layout.tsx       # Root layout com providers
├── core/
│   ├── entities/
│   │   ├── learner.ts
│   │   ├── mastery.ts
│   │   ├── lesson.ts
│   │   ├── pack.ts
│   │   └── item.ts
│   ├── value-objects/
│   │   ├── cefr-level.ts
│   │   ├── theta.ts
│   │   ├── skill-id.ts
│   │   └── item-id.ts
│   ├── repositories/
│   │   ├── ilesson-repository.ts
│   │   ├── imastery-repository.ts
│   │   ├── ipack-repository.ts
│   │   └── iiitem-repository.ts
│   ├── services/
│   │   ├── mastery-gate-service.ts
│   │   └── next-activity-selector.ts
│   └── events/
├── application/
│   ├── startDiagnostic.ts
│   ├── submitPractice.ts
│   └── getNextActivity.ts
├── infrastructure/
│   ├── api/
│   │   ├── client.ts
│   │   ├── learners.ts
│   │   ├── content.ts
│   │   └── practice.ts
│   ├── storage/
│   │   ├── local-storage.ts
│   │   └── indexed-db.ts
│   └── audio/
│       ├── signer.ts
│       └── player.ts
├── presentation/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── forms/
│   │   ├── practice-form.tsx
│   │   └── diagnostic-form.tsx
│   ├── charts/
│   │   ├── mastery-chart.tsx
│   │   └── progress-chart.tsx
│   ├── audio/
│   │   ├── player.tsx
│   │   └── recorder.tsx
│   └── layout/
│       ├── navbar.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── shared/
│   ├── types.ts
│   ├── constants.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

---

## 7. Critérios de Sucesso (Definition of Done)

- [ ] Aplicação inicia sem erros (`npm run dev` e `npm run build`)
- [ ] `tsc --noEmit` passa com 0 erros
- [ ] Gate de testes passa (vitest + playwright)
- [ ] PWA instala no navegador e funciona offline
- [ ] Fluxo completo: diagnóstico → lição → prática → progresso funciona
- [ ] Acessibilidade: navegação por teclado, leitor de tela, contraste
- [ ] Docker build e push funcionam
- [ ] Helm chart/ArgoCD deploy funcionam (se aplicável)

---

## 8. Estimativa de Tempo

| Fase | Estimativa |
|------|------------|
| Fase 1: Setup | 2-3 dias |
| Fase 2: Domínio e API | 3-4 dias |
| Fase 3: Interface | 5-7 dias |
| Fase 4: Testes | 3-4 dias |
| Fase 5: Deploy | 2-3 dias |
| **Total** | **15-21 dias** |

---

## 9. Agentes e Skills do OpenCode por Fase

### Fase 1: Setup e Infraestrutura

| Agente | Função |
|--------|--------|
| `devops-engineer` | Docker, Kubernetes, Helm, ArgoCD, CI/CD, variáveis de ambiente |
| `general` | Coordenar criação do projeto, configurar ferramentas, pesquisar documentação |

| Skill | Uso |
|-------|-----|
| `opencode` | Configurar ambiente OpenCode para o projeto frontend |
| `clean-architecture` | Definir separação de camadas desde o setup inicial |

---

### Fase 2: Camada de Domínio e Aplicação (Clean Architecture)

| Agente | Função |
|--------|--------|
| `api-developer` | Definir contratos de consumo, alinhar com OpenAPI, implementar API clients |
| `explore` | Mapear endpoints existentes no backend, entender schemas de resposta |
| `general` | Coordenar definição de entidades, value objects e casos de uso |

| Skill | Uso |
|-------|-----|
| `openapi-spec` | Validar e gerar tipos a partir do `api-spec.openapi.yaml` |
| `clean-architecture` | Aplicar separação domain/application/infrastructure/presentation |
| `contract-testing` | Garantir conformidade entre contrato OpenAPI e implementação frontend |

---

### Fase 3: Interface do Usuário

| Agente | Função |
|--------|--------|
| `api-developer` | Integrar componentes com clientes de API, gerenciar estado via TanStack Query |
| `security-engineer` | Configurar autenticação, CORS, proteção de rotas, OWASP ASVS |
| `test-engineer` | Definir testes de componentes e integração desde o início (TDD) |
| `devops-engineer` | Configurar build otimizado, variáveis de ambiente de produção |

| Skill | Uso |
|-------|-----|
| `testing-strategy` | Planejar testes de unidade, integração e E2E para a interface |
| `owasp-asvs` | Verificar conformidade de segurança da interface (autenticação, CORS, headers) |
| `clean-architecture` | Manter separação entre presentation e application/domain |
| `contract-testing` | Validar que componentes respeitam schemas da API |

---

### Fase 4: Testes e Qualidade

| Agente | Função |
|--------|--------|
| `test-engineer` | Executar e revisar testes de unidade, integração e E2E |
| `security-engineer` | Auditoria de acessibilidade (axe-core), testes de segurança (OWASP) |
| `general` | Coordenar correção de bugs encontrados nos testes |

| Skill | Uso |
|-------|-----|
| `testing-strategy` | Executar pirâmide de testes: unit → integration → E2E |
| `owasp-asvs` | Verificar LGPD/GDPR, autenticação, proteção de dados do aluno |
| `contract-testing` | Validar conformidade de contratos em testes de integração |

---

### Fase 5: Deploy

| Agente | Função |
|--------|--------|
| `devops-engineer` | Docker multi-stage, Kubernetes, Helm, ArgoCD, monitoramento |
| `security-engineer` | Configurar headers de segurança, CSP, rate limiting no frontend |
| `general` | Coordenar release, documentar variáveis de ambiente de produção |

| Skill | Uso |
|-------|-----|
| `owasp-asvs` | Verificar segurança do deploy (headers, cookies, CSP) |
| `observability-stack` | Configurar métricas, logs, rastreamento do frontend |

---

## 10. Critérios de Sucesso (Definition of Done)

- [ ] Aplicação inicia sem erros (`npm run dev` e `npm run build`)
- [ ] `tsc --noEmit` passa com 0 erros
- [ ] Gate de testes passa (vitest + playwright)
- [ ] PWA instala no navegador e funciona offline
- [ ] Fluxo completo: diagnóstico → lição → prática → progresso funciona
- [ ] Acessibilidade: navegação por teclado, leitor de tela, contraste
- [ ] Docker build e push funcionam
- [ ] Helm chart/ArgoCD deploy funcionam (se aplicável)

---

## 11. Nota

Plano armazenado em `/home/dalmo/.opencode/plan/frontend-interface.md` conforme instruções do Plan mode.
Nenhum arquivo do repositório foi modificado durante este planejamento.
Quando o usuário decidir implementar, deverá sair do Plan mode e usar o agente apropriado.
