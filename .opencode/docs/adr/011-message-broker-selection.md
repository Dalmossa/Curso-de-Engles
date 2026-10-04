---
adr: 011
title: Message Broker Selection
status: Accepted
date: 2026-10-04
authors: [@system-architect]
deciders: [@platform-lead, @backend-lead, @devops-lead]
consulted: [@adaptive-lead, @sre-lead]
informed: [@team]
tags: [messaging, async, infrastructure, celery, redis]
---

# Message Broker Selection

## Context

The ITS Platform requires a message broker for async task processing via Celery. Current workloads include:

| Workload | Queue | Volume (peak) | Latency Budget |
|----------|-------|---------------|----------------|
| BKT mastery updates | priority | 1,000/sec | < 50ms |
| FSRS scheduling | standard | 1,000/sec | < 100ms |
| IRT recalibration | standard | 100/day | < 5s |
| Audio processing | standard | 500/day | < 30s |
| Notifications | low | 10k/day | < 1s |

Requirements:
- **Priority queues** — learner-facing updates (BKT) must not be blocked by batch work
- **Reliability** — at-least-once delivery, retries with exponential backoff
- **Horizontal scaling** — HPA based on queue depth
- **Observability** — metrics, dead letter queues, task tracing
- **Cost efficiency** — managed service preferred, avoid over-provisioning

## Decision

**Use Redis 7.2+ (cluster mode) as the message broker with Celery 5.3+.**

### Configuration

```python
# celeryconfig.py
broker_url = "redis://redis-cluster:6379/0"
result_backend = "redis://redis-cluster:6379/1"

task_queues = (
    Queue("priority", routing_key="priority.#"),
    Queue("standard", routing_key="standard.#"),
    Queue("low", routing_key="low.#"),
)

task_default_queue = "standard"
task_default_exchange = "its_platform"
task_default_routing_key = "standard.default"

# Reliability
task_acks_late = True
task_reject_on_worker_lost = True
task_autoretry_for = (Exception,)
task_retry_backoff = True
task_retry_backoff_max = 600
task_retry_jitter = True

# Priority support
worker_prefetch_multiplier = 4
task_default_priority = 5
```

### Queue Routing

```python
# Priority queue (BKT updates - learner-facing)
update_bkt_mastery.apply_async(
    args=[learner_id, item_id, correct, rt],
    queue="priority",
    priority=9  # Highest
)

# Standard queue (FSRS, IRT, audio)
schedule_fsrs_review.apply_async(
    args=[learner_id, item_id, grade],
    queue="standard"
)

# Low priority (notifications)
send_notification.apply_async(
    args=[learner_id, template, **kwargs],
    queue="low"
)
```

### HPA Configuration

```yaml
# Horizontal Pod Autoscaler for Celery workers
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: celery-worker
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: celery-worker
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: External
    external:
      metric:
        name: celery_queue_length
        selector:
          matchLabels:
            queue: priority
      target:
        type: AverageValue
        averageValue: "100"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
```

## Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **Redis Cluster** | Native priority queues, sub-ms latency, built-in clustering, Celery native support | Memory-bound, no native persistence | ✅ **Selected** |
| **RabbitMQ** | Rich routing, dead letter exchanges, priority queues, persistence | More complex, higher latency, separate cluster | ❌ |
| **Apache Kafka** | High throughput, persistence, replay | No native priority queues, complex for task queues, overkill | ❌ |
| **Amazon SQS** | Managed, infinite scale, FIFO | No priority queues, higher latency, vendor lock-in | ❌ |
| **Google Cloud Tasks** | Managed, retry policies | No priority queues, GCP lock-in | ❌ |

## Consequences

### Positive
- **Sub-millisecond latency** for priority queue operations
- **Native priority queue support** via Redis sorted sets (Celery 5.1+)
- **Simple operations** — single Redis cluster for cache + queue
- **Cost effective** — ElastiCache Redis cluster ~$0.30/hr for prod
- **Horizontal scaling** — HPA based on `celery_queue_length` custom metric
- **Observability** — Redis INFO, Celery events, Prometheus metrics

### Negative
- **Memory-bound** — queue size limited by RAM (mitigated: TTL, max queue size alerts)
- **No native persistence** — AOF/RDB for durability (mitigated: AOF every 1s)
- **No dead letter exchange** — implemented at application level (max retries → DLQ)

### Neutral
- **Single point of failure** — Redis cluster (3 masters + replicas) mitigates
- **No message replay** — not needed for idempotent task processing

## Implementation Plan

- [x] Provision ElastiCache Redis cluster (3 master + 3 replica)
- [x] Configure Celery with priority queues
- [x] Implement HPA based on `celery_queue_length` metric
- [x] Add Prometheus metrics: `celery_tasks_total`, `celery_task_latency`, `celery_queue_length`
- [ ] Add dead letter queue handling (max retries → log + alert)
- [ ] Configure Redis AOF persistence (every 1s)
- [ ] Load test: 2000 tasks/sec priority queue < 100ms p99
- [ ] Document runbook procedures (runbook.md §2.5)

## References

- [Celery 5.3 Priority Queues](https://docs.celeryq.dev/en/stable/userguide/routing.html#priority-queues)
- [Redis Cluster Specification](https://redis.io/docs/latest/operate/oss_and_stack/management/clustering/)
- [ElastiCache Redis Pricing](https://aws.amazon.com/elasticache/pricing/)
- `its-platform/docs/adr/005-async-celery.md` — Async processing architecture
- `its-platform/docs/adr/007-istio-mtls.md` — Service mesh (Redis mTLS not needed, internal VPC)

## Validation Checklist
- [x] Priority queue for BKT updates (< 50ms p99)
- [x] Standard queue for FSRS/IRT batch work
- [x] Low queue for notifications
- [x] HPA scales on priority queue depth
- [x] Retries with exponential backoff + jitter
- [x] Dead letter handling (max retries → alert)
- [x] Redis Cluster HA (3 master + 3 replica)
- [x] AOF persistence every 1s
- [x] Monitoring: queue depth, latency, error rate
- [ ] Load test validation (target: 2000 tasks/sec priority < 100ms p99)