---
adr: 005
title: Async processing via Celery + Redis
status: Accepted
date: 2026-10-03
authors: [@platform-lead, @backend-lead]
deciders: [@platform-lead, @backend-lead, @adaptive-lead]
consulted: [@sre-lead]
informed: [@team]
tags: [async, celery, redis, queue, workers]
---

## Context

The ITS Platform has several workloads that must not block API responses:

| Workload | Trigger | Latency Budget | Volume |
|---|---|---|---|
| BKT mastery update | Practice submission | < 50ms | 1000/sec peak |
| IRT recalibration | Diagnostic complete, periodic | < 5s (async) | 100/day |
| FSRS scheduling | Every practice item | < 10ms | 1000/sec peak |
| Audio processing | Pronunciation upload | < 30s (async) | 500/day |
| Spaced review queue generation | Nightly + on mastery change | < 1min | 10k learners |
| Notification delivery | Streaks, achievements | < 1s | 10k/day |

Requirements:
- **Non-blocking** — API returns 202 Accepted, processes async
- **Reliable** — at-least-once delivery, idempotent tasks
- **Scalable** — horizontal worker scaling based on queue depth
- **Observable** — task tracking, retries, dead letter queue
- **Priority** — BKT updates > FSRS > IRT > notifications

## Decision

**Use Celery 5.3+ with Redis 7.2+ (cluster mode) for async task processing.**

### Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│  FastAPI    │────▶│  Redis      │────▶│  Celery Workers │
│  (Producer) │     │  (Broker)   │     │  (Consumers)    │
└─────────────┘     └─────────────┘     └─────────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
              ┌──────────┐  ┌──────────┐
              │ Priority │  │ Standard │
              │ Queue    │  │ Queue    │
              └──────────┘  └──────────┘
```

### Task Definitions

```python
# tasks.py
from celery import Celery
from its_platform.adaptive.engine import AdaptiveEngine

app = Celery("its_platform")
app.config_from_object("its_platform.celeryconfig")

# Priority queue for learner-facing updates
@app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=5,
    acks_late=True,
    reject_on_worker_lost=True,
    queue="priority"
)
def update_bkt_mastery(self, learner_id: str, item_id: str, correct: bool, response_time_ms: int):
    engine = AdaptiveEngine()
    engine.update_bkt(learner_id, item_id, correct, response_time_ms)

# Standard queue for batch/periodic work
@app.task(
    bind=True,
    max_retries=2,
    default_retry_delay=60,
    queue="standard"
)
def recalibrate_irt(self, learner_id: str):
    engine = AdaptiveEngine()
    engine.recalibrate_irt(learner_id)

@app.task(
    bind=True,
    max_retries=3,
    queue="standard"
)
def schedule_fsrs_review(self, learner_id: str, item_id: str, grade: int):
    engine = AdaptiveEngine()
    engine.schedule_fsrs(learner_id, item_id, grade)

# Low priority for notifications
@app.task(
    bind=True,
    max_retries=5,
    default_retry_delay=300,
    queue="low"
)
def send_notification(self, learner_id: str, template: str, **kwargs):
    ...
```

### Celery Config

```python
# celeryconfig.py
from kombu import Queue

broker_url = "redis://redis-cluster:6379/0"
result_backend = "redis://redis-cluster:6379/1"

task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]

timezone = "UTC"
enable_utc = True

# Queues with priority
task_queues = (
    Queue("priority", routing_key="priority.#"),
    Queue("standard", routing_key="standard.#"),
    Queue("low", routing_key="low.#"),
)

task_default_queue = "standard"
task_default_exchange = "its_platform"
task_default_routing_key = "standard.default"

# Worker settings
worker_prefetch_multiplier = 4
worker_max_tasks_per_child = 1000
worker_disable_rate_limits = True

# Reliability
task_acks_late = True
task_reject_on_worker_lost = True
task_autoretry_for = (Exception,)
task_retry_backoff = True
task_retry_backoff_max = 600
task_retry_jitter = True

# Monitoring
worker_send_task_events = True
task_send_sent_event = True

# Result expiration
result_expires = 86400  # 24h
```

### Routing

```python
# FastAPI producer
from its_platform.tasks import update_bkt_mastery, recalibrate_irt

@router.post("/practice")
async def submit_practice(...):
    # ... validate, score ...
    # Fire-and-forget for BKT update (priority)
    update_bkt_mastery.apply_async(
        args=[str(learner_id), item_id, correct, response_time_ms],
        queue="priority",
        priority=9  # Highest
    )
    # Fire-and-forget for FSRS (standard)
    schedule_fsrs_review.apply_async(
        args=[str(learner_id), item_id, grade],
        queue="standard"
    )
    return PracticeResult(...)
```

## Consequences

### Positive
- **Non-blocking APIs** — practice submission returns in ~50ms
- **Horizontal scaling** — HPA on queue depth (`celery_queue_length` metric)
- **Reliability** — acks_late + retries + DLQ = at-least-once
- **Priority queues** — learner-facing updates never stuck behind batch jobs
- **Observability** — Flower UI, Prometheus metrics (`celery_tasks_total`, `celery_task_latency`)

### Negative
- **Operational complexity** — Redis cluster, worker scaling, broker HA
- **Idempotency required** — tasks must be safely retryable (use deterministic IDs)
- **Debugging** — distributed tracing needed (OpenTelemetry + Celery signals)
- **Cold start** — worker spin-up adds latency for burst traffic

### Neutral
- **Redis as broker** — single point of failure; mitigated by Redis Cluster
- **Result backend** — Redis (not DB) for speed; results expire in 24h

## Alternatives Considered

1. **FastAPI BackgroundTasks** — In-process, no persistence, no scaling, no retries
2. **RQ (Redis Queue)** — Simpler but no priority queues, no horizontal scaling
3. **Dramatiq** — Good but smaller ecosystem, less monitoring
4. **Kafka + Consumers** — Overkill for task queue; better for event streaming
5. **AWS SQS + Lambda** — Vendor lock-in, cold starts, no priority queues

## Implementation Plan

- [x] Add `celery[redis]`, `redis[hiredis]`, `flower` to `pyproject.toml`
- [x] Create `celeryconfig.py` with priority queues
- [x] Define tasks: `update_bkt_mastery`, `recalibrate_irt`, `schedule_fsrs_review`, `send_notification`
- [x] Add `Celery` app factory with lifespan management
- [x] Configure HPA: `celery_queue_length` → replica count
- [ ] Add OpenTelemetry instrumentation for Celery
- [ ] Dead letter queue handling (max retries → DLQ)
- [ ] Flower dashboard behind auth
- [ ] Load test: 2000 tasks/sec priority queue < 100ms p95

## References

- `api-spec.openapi.yaml` — `PracticeResult` returned before async completion
- `stats-progress-evaluation-spec.md` — BKT/IRT/FSRS update triggers
- `threat-model.md` §3.5 — Denial of Service D-01
- Celery docs: https://docs.celeryq.dev
- Redis Cluster: https://redis.io/docs/latest/operate/oss_and_stack/management/clustering/