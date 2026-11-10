---
name: bullmq-its
description: Use ao criar, enfileirar ou monitorar jobs assíncronos no backend NestJS do ITS (BullMQ via QueueService — este repo não usa Celery).
---

# Filas Assíncronas — BullMQ no ITS (`src/infrastructure/queue/`)

> **Nota histórica:** esta skill existia como `celery-tasks` e documentava Python/Celery — renomeada para `bullmq-its`. O backend é NestJS 10 (ESM) e a fila real é **BullMQ** atrás da abstração `QueueService`/`TaskProcessor` (ADR-005, ADR-011). Não existe Celery neste repo.

## Arquitetura real

```
modules/* (producer) → QueueService (typed enqueue) → Redis → TaskProcessor (Workers)
                                                                    │
                                              ┌─────────────────────┼─────────────────────┐
                                              ▼                     ▼                     ▼
                                     queue "priority"       queue "standard"        queue "low"
                                     BKT, eventos           FSRS, IRT               notificações
                                     conc. 10 +             conc. 5                 conc. 2
                                     rate 1000/s
```

- **Regra**: toda fila passa pela abstração em `src/infrastructure/queue/` — jamais `Queue`/`Worker` do BullMQ direto em módulo (ver `clean-architecture`, Dependency Rule).

## Producers — `QueueService`

```ts
constructor(private readonly queueService: QueueService) {}

// helpers tipados por tipo de tarefa:
await this.queueService.enqueueBktUpdate(learnerId, itemId, correct, rtMs, itemType, nOptions, skillId);
await this.queueService.enqueueFsrsReview(learnerId, itemId, grade, masteryProb, skillId);
await this.queueService.enqueueIrtRecalibration(learnerId, diagnosticId);
await this.queueService.enqueueNotification(learnerId, template, payload);
await this.queueService.enqueueDomainEvent(eventType, payload, correlationId);
// genérico: this.queueService.enqueue('scheduleFsrsReview', data, { attempts: 5 })
```

- Defaults do `enqueue`: `attempts: 3`, backoff fixo 5 s (`'exponential'` → 1 s exponencial), priority 9 na fila `priority` (5 nas demais), `removeOnComplete: true`, `removeOnFail: false`.
- **Idempotência**: passe `jobId` determinístico (ex.: `bkt:${learnerId}:${itemId}:${skillId}`) — job duplicado é ignorado pelo BullMQ.

## Novo tipo de tarefa (3 passos)

1. Adicionar o payload em `QueueJobData` (`queue.service.ts`).
2. Rotear em `selectQueue()` (priority/standard/low).
3. Tratar em `TaskProcessor.processJob()` — validar data antes de usar (`as QueueJobData['nome']` + guard).

## Consumers — `TaskProcessor`

- Cria um `Worker` por fila na `onModuleInit`, com concorrência e rate limit; shutdown gracioso fecha todos (`onModuleDestroy`).
- Redis via `ConfigService`: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`.
- O `AdaptiveEngine` (domínio) é injetado via `setAdaptiveEngine()` — workers chamam o domínio, nunca o contrário.

## Confiabilidade

- Retry: `attempts` + `backoff` (defaults acima); job que esgota falha e fica em `removeOnFail: false` para inspeção.
- Eventos monitorados: `completed`, `failed`, `stalled`, `error` (logs via `Logger` do Nest).
- Anti-duplicação: `jobId`; anti-perda: retry + stalled detection do BullMQ.

## Monitoramento

- `queueService.getAllMetrics()` → `{ waiting, active, completed, failed, delayed }` por fila.
- `QueueHealthIndicator` (`queue-health.indicator.ts`) expõe a fila ao Terminus (health checks).
- `getJobStatus(queue, jobId)` para rastrear job específico.

## Checklist

- [ ] Producer usa `QueueService` (nunca BullMQ direto)
- [ ] Novo task type: `QueueJobData` + `selectQueue` + `processJob`
- [ ] `jobId` em jobs que não podem duplicar (ex.: BKT por resposta)
- [ ] Payload validado no consumer antes de tocar no domínio
- [ ] Métricas/logs para tarefa nova (fila, latência, falhas)
