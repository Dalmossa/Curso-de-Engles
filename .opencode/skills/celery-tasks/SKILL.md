---
name: Celery Tasks
description: Async task patterns, priority queues, retries, monitoring for ITS Platform
---

# Celery Tasks Skill — ITS Platform

## When to Use
- Creating async tasks for BKT/IRT/FSRS updates
- Configuring priority queues
- Setting up retries, dead letter queues
- Monitoring task performance

## Architecture

```
FastAPI (Producer) → Redis (Broker) → Celery Workers (Consumers)
                          │
                    ┌─────┴─────┐
                    ▼           ▼
              Priority Queue  Standard Queue
              (BKT updates)   (FSRS, IRT, notifications)
```

## Configuration

```python
# its_platform/celeryconfig.py
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

## Task Definitions

```python
# its_platform/tasks.py
from celery import Celery
from its_platform.adaptive.engine import AdaptiveEngine

app = Celery("its_platform")
app.config_from_object("its_platform.celeryconfig")

# Priority queue - learner-facing updates
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

# Standard queue - batch/periodic work
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

# Low priority - notifications
@app.task(
    bind=True,
    max_retries=5,
    default_retry_delay=300,
    queue="low"
)
def send_notification(self, learner_id: str, template: str, **kwargs):
    ...
```

## FastAPI Producer

```python
# its_platform/api/v1/practice.py
from fastapi import APIRouter, Depends
from its_platform.tasks import update_bkt_mastery, schedule_fsrs_review

@router.post("/v1/learners/{learner_id}/practice")
async def submit_practice(learner_id: UUID, submission: PracticeSubmission):
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

## HPA (Horizontal Pod Autoscaler)

```yaml
# its-platform/helm/its-platform/templates/hpa-celery.yaml
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

## Monitoring

```python
# Prometheus metrics
from prometheus_client import Counter, Histogram

celery_tasks_total = Counter(
    "celery_tasks_total",
    "Total Celery tasks",
    ["task_name", "queue", "status"]  # status: success, failure, retry
)

celery_task_latency = Histogram(
    "celery_task_latency_seconds",
    "Celery task latency",
    ["task_name", "queue"],
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 5.0, 10.0]
)

# In task
@app.task(bind=True)
def update_bkt_mastery(self, learner_id, item_id, correct, rt):
    start = time.time()
    try:
        engine.update_bkt(...)
        celery_tasks_total.labels("update_bkt_mastery", "priority", "success").inc()
    except Exception as e:
        celery_tasks_total.labels("update_bkt_mastery", "priority", "failure").inc()
        raise
    finally:
        celery_task_latency.labels("update_bkt_mastery", "priority").observe(time.time() - start)
```

## Validation Checklist
- [ ] Priority queue for learner-facing updates (BKT)
- [ ] Standard queue for batch work (FSRS, IRT)
- [ ] Low queue for notifications
- [ ] acks_late + retries + DLQ for reliability
- [ ] HPA based on queue depth
- [ ] Prometheus metrics for latency, throughput, errors
- [ ] Flower dashboard for task inspection