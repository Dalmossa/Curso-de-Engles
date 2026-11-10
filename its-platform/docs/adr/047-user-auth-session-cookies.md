---
adr: 047
title: "Autenticação de usuário com sessão via cookies httpOnly"
status: Proposed
date: 2026-10-20
authors: [@orchestrator]
deciders: [unassigned]
consulted: [@api-developer, @frontend-developer, @security-engineer]
informed: [@team]
tags: [auth, security, frontend, backend, adr-013, cookies, session, oauth, oidc, google]
relates_to: [013]
supersedes: [013]
supersedes_scope: "ADR-013 §4.5 e partes relacionadas à 'emissão de tokens' ficam emendadas. O backend deixa de ser estritamente 'Resource Server sem emissão' para também atuar como Authorization Server no primeiro slice com sessão httpOnly. A premissa 'não emite tokens' permanece válida para fluxos externos, mas passa a ser permitida a emissão de sessão própria para autenticação de usuário no ITS Platform."
---

# ADR-047: Autenticação de usuário com sessão via cookies httpOnly

**Proposto** (2026-10-20). Este ADR autoriza a troca do modelo atual de autenticação via `ITS_API_TOKEN` fixo por um fluxo real de **login de usuário** com sessão gerenciada por cookies `httpOnly`.

## Contexto

Atualmente o ITS Platform opera com o seguinte modelo:

- **Frontend:** `DirectApiGateway` lê `ITS_API_TOKEN` e `ITS_LEARNER_ID` diretamente das variáveis de ambiente do servidor Next.js. Não existe fluxo de login.
- **Backend:** `AuthController` possui apenas `POST /auth/refresh` retornando `501 Not Implemented`. Os comentários deixam claro que o MVP foi tratado como *Resource Server* e **não emite tokens** (conforme ADR-013).
- **UI:** Existe `/login` apenas como página informativa, dizendo que a autenticação ainda está sendo definida.
- **OpenAPI:** `POST /auth/refresh` está publicado, mas fora do escopo do MVP.

Esse modelo é prático para desenvolvimento local, mas **inviável para múltiplos usuários**. Além disso, não corresponde à expectativa de uma plataforma educacional moderna (semelhante ao benchmark analisado com `mairovergara.com`), onde o usuário espera **"Entrar"** com conta e senha e **"Continuar de onde parou"**.

## Decision Drivers

| # | Driver | Fonte | Consequência |
|---|---|---|---|
| 1 | **Múltiplos usuários** | Requisito do usuário | Precisa existir identidade por usuário/sessão, não um token único para todo ambiente |
| 2 | **UX esperada** | Benchmark (Mairo Vergara) | Tela de login/cadastro real, proteção de rotas autenticadas, sessão persistente |
| 3 | **Server-first no Next.js** | Arquitetura frontend atual | Prefere cookies `httpOnly` ao invés de `localStorage`. Mantém alinhado com Server Components/Server Actions |
| 4 | **Spec-First** | `CONSTITUTION.md` §2 | Mudança de escopo de auth precisa de ADR (CONSTITUTION §5) |
| 5 | **Segurança** | Boas práticas | Cookies `httpOnly`, `Secure` (em prod), `SameSite=Lax/Strict`, rotação em `refresh`, proteção contra CSRF quando aplicável |
| 6 | **Não quebrar o slice atual** | ADR-013 | O fluxo com `ITS_API_TOKEN` pode ser mantido como **modo desenvolvimento/fallback** enquanto a migração acontece |

## Opções Consideradas

| Opção | Descrição | Vantagens | Desvantagens |
|---|---|---|---|
| **A) Cookie httpOnly (sessão)** | `POST /auth/login` emite cookie de sessão (access/refresh ou sessão opaca). Frontend envia cookie automaticamente. | Seguro, idiomático pro App Router, não expõe token ao JS, fácil de proteger rotas via middleware. | Precisa mexer em `DirectApiGateway` e criar lógica de sessão no backend. |
| **B) Bearer token no localStorage** | Frontend guarda access token e envia `Authorization: Bearer ...` | Rápido de implementar. | Mais vulnerável a XSS, menos integrado com Server Components, pior pra "server-first". |
| **C) Google OAuth 2.0 / OpenID Connect (Sign in with Google)** | Permitir login com conta Google, emitindo os mesmos cookies httpOnly. | UX familiar, menos fricção (sem criar senha), menor chance de senha fraca, email verificado pelo Google. | Precisa configurar OAuth no Google Cloud, tratar `state`/PKCE, vinculação de conta e regras de criação. |
| **D) Manter apenas `ITS_API_TOKEN`** | Não fazer login por usuário. | Zero esforço. | Não atende ao requisito. Inviável para múltiplos usuários. |

**Escolha:** **Opção A) Cookie httpOnly (sessão) + Opção C) Google OAuth 2.0 / OIDC**

## Decisão

**D1.** O backend passa a **autorizar emissão de sessão** para autenticação de usuários do ITS. O `POST /auth/refresh` deixa de retornar `501` e passa a ser funcional, seguindo o shape já previsto no OpenAPI.

**D2.** O frontend passa a ter fluxo real de autenticação:
- Rota `(auth)/login` com formulário funcional (e-mail/senha)
- Cookie `httpOnly` enviado pelo backend no login
- Middleware para proteger rotas autenticadas (`(dashboard)`, `lessons/`, `mastery/`, `practice/`)
- `DirectApiGateway` passa a priorizar sessão por cookie quando disponível, mantendo fallback para `ITS_API_TOKEN` apenas em modo **dev/local**.

**D3.** Segurança mínima obrigatória:
- Cookies `httpOnly`, `Secure` em produção, `SameSite=Lax`
- Hash de senha com algoritmo moderno (Argon2/bcrypt)
- Rotação de refresh token ou invalidação em logout
- Não logar credenciais/tokens
- Respeitar RBAC quando aplicável

**D4.** Transição gradual:
- Enquanto não houver migração completa, o modo `ITS_API_TOKEN` continua funcionando para não quebrar o ambiente atual.
- A página `/login` deixa de ser puramente informativa e vira formulário funcional com **e-mail/senha** e **"Entrar com Google"**.

**D5.** Suporte a autenticação via **Google OAuth 2.0 / OpenID Connect (Sign in with Google)**:
- **Fluxo via backend:** `GET /auth/google` inicia o redirecionamento ao Google com `state` (e opcionalmente `PKCE`). `GET /auth/google/callback` recebe o `code`, troca por tokens no Google, valida o `id_token`/perfil e localiza ou cria o usuário no ITS.
- **Sessão unificada:** Ao autenticar com sucesso (email/senha ou Google), o backend emite os **mesmos cookies `httpOnly`** utilizados pelo fluxo de sessão (`Set-Cookie`). Não há token JWT exposto ao JavaScript do browser.
- **Vinculação de conta:** Caso um e-mail já exista com login por senha, deve-se permitir vincular a conta Google ao mesmo usuário (ou exigir confirmação), evitando criação de contas duplicadas.
- **Criação automática controlada:** Na primeira vez com Google, criar usuário com `email_verified: true` (confiando na verificação do Google), `provider: 'google'` e `provider_id: <sub>`. Campos obrigatórios devem ser preenchidos com o mínimo viável ou via tela de complemento se necessário.
- **Botão na UI:** Adicionar botão `"Continuar com Google"` na rota `(auth)/login`, com redirecionamento para `GET /auth/google`.

## Consequências

### Positivas
- Suporte real a múltiplos usuários
- UX muito mais próxima do esperado (comparado ao Mairo Vergara)
- Alinhado com arquitetura server-first do Next.js
- Facilita "Continuar de onde parei" por usuário
- Permite evoluir para perfis, permissões e futuras integrações

### Negativas
- Aumenta complexidade (sessão, hash de senha, rotação)
- Precisa mexer em gateway, middleware e rotas
- Exige cuidado com CSRF/cookies em diferentes ambientes
- Emenda parcialmente o ADR-013

### Neutras
- Mantém compatibilidade com o OpenAPI existente
- Não força remoção de `ITS_API_TOKEN` imediatamente

## Plano de Implementação

| Etapa | Descrição | Dono |
|---|---|---|
| **1. ADR + Backlog** | Criar/atualizar ADR-047, atualizar README, BACKLOG e MEMORY | Orquestrador |
| **2. Backend - Auth (email/senha)** | Criar entidade/tabela de usuário (se não existir), `AuthService` com `login`, `refresh`, `logout`. Hash de senha, rotação de sessão, tornar `POST /auth/refresh` funcional. Atualizar `AuthController`. | `api-developer` |
| **2b. Backend - Google OAuth** | Implementar `GET /auth/google`, `GET /auth/google/callback`. Validar `state`, trocar `code` por tokens no Google, validar `id_token`/perfil, vincular/criar usuário, emitir cookies de sessão unificados. Adicionar variáveis `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`. | `api-developer` |
| **3. Backend - Guards/Middleware** | Garantir que rotas protegidas validem sessão/cookie. Atualizar OpenAPI com os novos endpoints `/auth/google*` (ou documentar via decorators). | `api-developer` |
| **4. Frontend - Auth Flow** | Criar `(auth)/login` funcional com **formulário email/senha** e botão **"Continuar com Google"**. Criar `auth-actions.ts` (Server Actions), cookie handling, middleware de proteção, provider de sessão. | `frontend-developer` |
| **5. Frontend - Gateway** | Ajustar `DirectApiGateway`/HTTP client para enviar cookie. Manter fallback `ITS_API_TOKEN` em dev. Tratar redirecionamento pós-login. | `frontend-developer` |
| **6. Segurança & Config** | Garantir `httpOnly`, `Secure` (prod), `SameSite=Lax`, proteção `state` no OAuth, evitar vazamento de segredos, revisar CORS/cookies entre domínios. Adicionar ao `.env.example` as chaves Google. | `security-engineer` |
| **7. Testes & Verificação** | Testar login/senha, "Entrar com Google", callback, refresh, logout, proteção de rotas, vinculação de conta e não quebrar fluxo com token em dev. Rodar `typecheck`, `lint`, `build`. | `frontend-tester` / `test-engineer` |

## Referências

- [ADR-013](013-auth-architecture-resource-vs-authorization-server.md) — Arquitetura de auth atual (emendado por este ADR)
- [CONSTITUTION.md](../CONSTITUTION.md) §2, §5
- [api-spec.openapi.yaml](../docs/api-spec.openapi.yaml) — `/auth/refresh`
- [Frontend routes](../../its-platform/frontend/src/shared/routes.ts)
- [DirectApiGateway](../../its-platform/frontend/src/infrastructure/api/direct-api-gateway.ts)
