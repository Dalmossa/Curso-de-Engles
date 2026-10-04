---
adr: 011
title: Message Broker Selection for ITS Platform
status: Accepted
date: 2026-10-04
authors: [@system-architect]
deciders: [@system-architect, @platform-lead, @backend-lead]
consulted: [@sre-lead, @adaptive-lead, @security-engineer]
informed: [@team]
tags: [messaging, broker, queue, streaming, kafka, redis, rabbitmq, nats, pulsar]
---

## Context

The ITS Platform requires a message broker (or brokers) to support multiple communication patterns:

| Use Case | Pattern | Latency Budget | Volume | Criticality |
|---|---|---|---|---|
| Celery task queue (BKT/IRT/FSRS updates) | Task queue (priority) | < 50ms p99 | 1,000/sec peak | Critical |
| Spaced review scheduling | Delayed/scheduled tasks | < 1min | 10k/day | High |
| Notification delivery (email, push, in-app) | Pub/Sub | < 1s | 10k/day | Medium |
| Domain events (learner progress, mastery changes) | Event streaming | < 100ms | 500/sec | High |
| Audit logging (LGPD Art. 46 compliance) | Event streaming | < 500ms | 200/sec | Critical |
| Audio processing pipeline | Task queue (batch) | < 30s | 500/day | Medium |
| Real-time presence/typing indicators | Pub/Sub (ephemeral) | < 50ms | 5k/sec peak | Low |
| Inter-service communication (async) | Request/Reply, Events | < 200ms | Variable | High |

**Current state**: ADR-005 selected **Redis 7.2+ (cluster mode)** as the broker for Celery task processing. This works for the task queue use case but has limitations for event streaming, audit logs, and multi-consumer patterns.

**Decision needed**: Whether to standardize on Redis for all patterns, adopt a second broker for streaming/events, or select a unified broker that handles both queues and streams well.

### Requirements

#### Functional
- **Task queues**: Priority queues, delayed/scheduled execution, retries with backoff, dead-letter handling
- **Event streaming**: Persistent logs, replay, multiple consumer groups, ordering guarantees per partition
- **Pub/Sub**: Fan-out, ephemeral messages, presence/typing
- **Request/Reply**: RPC-style async communication between services

#### Non-Functional
| Requirement | Target |
|---|---|
| **Availability** | 99.95% (HA deployment) |
| **Durability** | No data loss on broker failure (acknowledged messages) |
| **Scalability** | Horizontal scaling to 10x current peak |
| **Latency** | p99 < 50ms for priority tasks; < 100ms for events |
| **Observability** | Metrics, logs, tracing (OpenTelemetry native) |
| **Security** | TLS/mTLS, SASL/SCRAM, ACLs, encryption at rest |
| **LGPD Compliance** | Data residency (Brazil), retention policies, audit trail, right to erasure support |
| **Operations** | Kubernetes-native (Operator/Helm), GitOps (ArgoCD), backup/restore |
| **Cost** | Minimize TCO (infrastructure + operational burden) |

#### Constraints
- **Python ecosystem**: First-class clients for FastAPI, Celery, native async (asyncio)
- **Kubernetes**: Must run on EKS/GKE, managed by ArgoCD
- **Team expertise**: Strong in Redis, PostgreSQL, Kafka basics; limited Pulsar/NATS experience
- **Current investment**: Redis Cluster already provisioned for Celery (ADR-005)

---

## Decision

**Adopt a dual-broker strategy:**

1. **Redis 7.2+ (Cluster Mode)** — Primary for **task queues** (Celery), **Pub/Sub** (ephemeral), **caching**, and **rate limiting**. Already provisioned per ADR-005.
2. **Apache Kafka (KRaft mode, Strimzi Operator on K8s)** — Primary for **event streaming**, **domain events**, **audit logs**, and **inter-service async communication**.

**Rationale**: No single broker excels at both low-latency priority task queues AND durable, replayable event streaming at scale. Redis excels at the former; Kafka at the latter. The operational cost of running both is justified by the architectural clarity and correctness for each pattern.

---

## Alternatives Considered

### 1. Redis Only (Streams + Lists)

**Description**: Use Redis Streams for event streaming, Lists for task queues, Pub/Sub for ephemeral.

| Pros | Cons |
|---|---|
| Single operational surface | Streams lack true consumer groups with rebalance protocol |
| Already deployed, team knows it | No native exactly-once; at-least-once requires careful idempotency |
| Low latency (< 1ms) | Retention limited by memory (costly for long audit logs) |
| Native priority via sorted sets | No log compaction for key-based deduplication |
| Consumer groups (since 5.0) | Scaling consumers requires manual partition management |
| Redis Stack adds search, JSON | No tiered storage (hot/cold) for cost optimization |

**Verdict**: ❌ **Rejected for streaming**. Adequate for task queues (current), but audit logs (7+ years retention per LGPD) and domain event replay need Kafka's durability, tiered storage, and mature consumer group protocol.

---

### 2. Apache Kafka Only (KRaft)

**Description**: Use Kafka for everything — tasks, events, pub/sub.

| Pros | Cons |
|---|---|
| Single broker, unified operations | High latency for priority tasks (p99 ~10-50ms vs Redis <1ms) |
| Exactly-once semantics (transactions) | No native priority queues; requires workaround (partition by priority) |
| Tiered storage (S3/GCS) for cost-effective retention | Consumer group rebalances cause latency spikes (stop-the-world) |
| Mature ecosystem, ksqlDB, Kafka Connect | Overkill for simple fire-and-forget tasks (Celery overhead) |
| Log compaction for deduplication | Operational complexity higher (ISR, controller, partition leadership) |
| Replay from any offset | Cold partitions = higher latency |

**Verdict**: ❌ **Rejected for task queues**. Priority task processing (BKT updates <50ms) suffers from Kafka's latency profile and lack of native priority queuing. Celery + Redis is purpose-built for this.

---

### 3. RabbitMQ 3.12+ (Quorum Queues + Streams)

**Description**: RabbitMQ for both queues (quorum) and streams (RabbitMQ Streams).

| Pros | Cons |
|---|---|
| True priority queues (priority + quorum) | Streams feature younger, less battle-tested than Kafka |
| Flexible routing (topics, headers, dead-letter) | No tiered storage; retention limited by disk |
| Protocol support (AMQP 0.9.1, MQTT, STOMP) | Consumer group rebalance less efficient than Kafka |
| Good management UI, Prometheus exporter | Scaling streams requires partition rebalancing (manual) |
| Quorum queues = HA, replicated | Smaller ecosystem for stream processing (no ksqlDB/Flink) |

**Verdict**: ⚠️ **Strong contender, but rejected**. RabbitMQ Streams closes the gap, but Kafka remains superior for high-throughput, long-retention event streaming with tiered storage. Running RabbitMQ + Kafka would be three brokers. RabbitMQ alone doesn't match Kafka for audit log retention at scale.

---

### 4. NATS / NATS JetStream

**Description**: NATS core for pub/sub, JetStream for persistence, streams, consumer groups.

| Pros | Cons |
|---|---|
| Extremely low latency (< 1ms) | JetStream younger; fewer production references at scale |
| Simple protocol, lightweight | No tiered storage (file-based only) |
| Native multi-tenancy, accounts | Consumer group scaling less mature |
| JetStream: persistence, replay, ack policies | Ecosystem smaller (no Kafka Connect, limited stream processing) |
| Single binary, easy ops | Python client (`nats.py`) good but less Celery integration |
| Leaf nodes for geo-distribution | Team has zero NATS production experience |

**Verdict**: ⚠️ **Rejected for now**. Excellent technology, but team lacks experience and ecosystem gaps (stream processing, connectors) make it risky for critical audit/event streaming. Revisit in 12-18 months.

---

### 5. Apache Pulsar

**Description**: Unified messaging + streaming, tiered storage (BookKeeper + S3), geo-replication.

| Pros | Cons |
|---|---|
| True separation of compute/storage | BookKeeper adds operational complexity (separate ensemble) |
| Tiered storage native (S3/GCS) | Smaller community than Kafka |
| Multi-tenancy built-in (namespaces, tenants) | Python client less mature; no Celery broker support |
| Geo-replication native | Schema registry less adopted |
| Functions (lightweight stream processing) | Steeper learning curve |

**Verdict**: ❌ **Rejected**. BookKeeper operational burden unjustified for current scale. Kafka + Strimzi gives similar tiered storage with better ecosystem and team familiarity.

---

### 6. Redpanda

**Description**: Kafka-compatible, Rust-based, no JVM, no ZooKeeper/KRaft, simpler ops.

| Pros | Cons |
|---|---|
| Kafka API compatible (drop-in) | Enterprise features (tiered storage, schema registry) paid |
| Single binary, no JVM tuning | Younger project; fewer production case studies at massive scale |
| Lower resource usage | Wasm transforms (data plane) not yet GA |
| Simpler cluster management | Ecosystem (Connect, ksqlDB) not fully compatible |

**Verdict**: ⚠️ **Strong contender for Kafka replacement**. If Kafka operational burden proves high, Redpanda is the migration path. For now, **Strimzi-managed Kafka** on K8s mitigates ops burden. Re-evaluate at scale.

---

### 7. Cloud-Managed: AWS SQS/SNS, Google Pub/Sub, Azure Service Bus

| Provider | Service | Pros | Cons |
|---|---|---|---|
| **AWS** | SQS (queues) + SNS (pub/sub) + EventBridge | Fully managed, infinite scale, pay-per-use, DLQ native, FIFO queues | Vendor lock-in, no priority queues (SQS), no replay (SNS), cross-region latency, cost at high volume |
| **GCP** | Pub/Sub | Managed, exactly-once, replay, ordering keys, push/pull | Vendor lock-in, no priority, cost at scale, limited ecosystem |
| **Azure** | Service Bus | Sessions, scheduling, DLQ, duplicate detection | Vendor lock-in, less Kubernetes-native, pricing complex |

**Verdict**: ❌ **Rejected as primary**. Vendor lock-in conflicts with multi-cloud/portability strategy. **Acceptable as secondary** for specific integrations (e.g., SES/SNS for email, EventBridge for AWS service events). Not for core domain events or task queues.

---

### 8. Hybrid: Redis (Tasks) + Kafka (Events) — **SELECTED**

| Pros | Cons |
|---|---|
| Right tool for each pattern | Two brokers to operate, monitor, secure |
| Redis: sub-ms latency, priority queues, Celery native | Data duplication risk (same event in both?) |
| Kafka: durability, replay, tiered storage, exactly-once | Cross-broker transactions not supported |
| Clear separation of concerns | Team must be proficient in both |
| Independent scaling | Slightly higher infra cost |

**Mitigation for "two brokers"**:
- Strimzi Operator makes Kafka on K8s GitOps-native (like Redis Operator)
- Shared observability stack (Prometheus, Grafana, Tempo)
- Clear ownership: Platform team owns both; docs + runbooks standardized
- Event bridge pattern: Celery tasks emit domain events → Kafka (single source of truth)

---

## Decision Matrix

| Criterion | Weight | Redis | Kafka | RabbitMQ | NATS/JetStream | Pulsar | Redpanda | Cloud (SQS/SNS) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Task queue latency (priority) | 20% | **5** | 2 | 4 | 4 | 3 | 2 | 2 |
| Event streaming (durability, replay) | 20% | 2 | **5** | 3 | 3 | 4 | 4 | 1 |
| Tiered storage / long retention | 15% | 1 | **5** | 1 | 1 | **5** | 3 (ent) | 3 |
| Exactly-once / transactions | 10% | 2 | **5** | 3 | 3 | 4 | **5** | 3 |
| Kubernetes/GitOps native | 10% | 4 | **5** (Strimzi) | 4 | 4 | 3 | 4 | 2 |
| Python ecosystem (Celery, FastAPI) | 10% | **5** | 4 | 4 | 3 | 2 | 4 | 3 |
| Operational simplicity | 5% | **5** | 3 | 3 | **5** | 2 | 4 | **5** |
| LGPD compliance (audit, residency) | 5% | 3 | **5** | 3 | 3 | 4 | 4 | 2 |
| Team expertise / learning curve | 5% | **5** | 3 | 3 | 2 | 2 | 3 | 3 |
| **Weighted Score** | 100% | **3.55** | **4.10** | 3.15 | 3.05 | 3.25 | 3.35 | 2.35 |

**Scoring**: 1=Poor, 2=Below Average, 3=Average, 4=Good, 5=Excellent

> **Note**: No single broker scores highest across all criteria. Redis wins on task queues; Kafka wins on streaming. The dual-broker strategy maximizes fitness-for-purpose.

---

## Consequences

### Positive
- **Task queues**: Sub-millisecond latency, native priority, Celery integration unchanged (ADR-005 valid)
- **Event streaming**: Durable, replayable, ordered logs with tiered storage for 7-year LGPD audit retention
- **Clear boundaries**: Tasks = "do work"; Events = "notify facts". No pattern contamination.
- **Independent scaling**: Redis cluster for throughput; Kafka partitions for parallelism
- **Technology fit**: Each broker used where it shines
- **Future-proof**: Kafka enables event sourcing, CQRS, CDC (Debezium), stream processing (Flink/ksqlDB)

### Negative
- **Operational surface**: Two brokers = double the monitoring, upgrades, security patching, backup/restore drills
- **Developer cognitive load**: Teams must know when to use which (enforced by architecture guidelines)
- **No cross-broker transactions**: "Task + Event" atomicity requires outbox pattern (see Implementation Plan)
- **Cost**: ~2x infrastructure vs single broker (mitigated by right-sizing each)

### Neutral
- **Data duplication**: Domain events published to Kafka; task results in Redis/DB. Acceptable with clear ownership.
- **Migration path**: If Redpanda matures, Kafka → Redpanda is API-compatible. Redis → Valkey/KeyDB possible.

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---:|---:|---|
| Operational overload managing two brokers | Medium | High | Strimzi Operator + Redis Operator; shared runbooks; dedicated platform team |
| Inconsistent usage (tasks in Kafka, events in Redis) | Medium | Medium | Architecture decision doc + code review guidelines; linting rules |
| Outbox pattern complexity for task+event atomicity | Medium | Medium | Library `its_platform.outbox` with SQLAlchemy event listeners; documented pattern |
| Kafka partition rebalance storms | Low | High | Static membership, incremental cooperative rebalance, adequate partition count |
| Redis Cluster failover latency spikes | Low | Medium | `cluster-replica-no-failover` for non-critical; client-side routing |
| LGPD audit log tampering | Low | Critical | Kafka log immutability + WORM S3 tiered storage; hash chaining in events |
| Vendor lock-in (Strimzi/Operators) | Low | Low | CNCF projects; standard K8s APIs; portable manifests |

---

## Implementation Plan

### Phase 1: Kafka Cluster (Strimzi) — Weeks 1-3
- [ ] Provision Kafka cluster via Strimzi Operator (3 brokers, KRaft mode)
- [ ] Configure tiered storage to S3 (Standard-IA → Glacier)
- [ ] Define topics: `learner.events`, `mastery.events`, `audit.logs`, `notification.commands`
- [ ] Topic configs: retention (7y audit), compaction (mastery), partitions (6x brokers)
- [ ] TLS/mTLS, SASL/SCRAM, ACLs per service account
- [ ] PrometheusRule alerts (under-replicated, offline partitions, lag)

### Phase 2: Producer/Consumer Libraries — Weeks 2-4
- [ ] `its_platform.events` library: `EventProducer`, `EventConsumer` with schema registry (Avro/Protobuf)
- [ ] Outbox pattern implementation: `OutboxEmitter` (DB transaction + Kafka send)
- [ ] Celery task decorator: `@emits_event("mastery.updated")` → auto-publish to Kafka
- [ ] Schema registry (Apicurio or Confluent) with compatibility checks in CI

### Phase 3: Migration & Integration — Weeks 4-6
- [ ] Migrate audit logging from DB → Kafka (`audit.logs` topic)
- [ ] Wire notification service to consume `notification.commands` from Kafka
- [ ] Add domain event emission to adaptive engine (BKT/IRT/FSRS changes)
- [ ] Implement consumer for `learner.events` → projection DB (read model)

### Phase 4: Observability & Hardening — Weeks 6-8
- [ ] OpenTelemetry instrumentation (Kafka producer/consumer spans)
- [ ] Grafana dashboards: broker health, consumer lag, throughput, latency
- [ ] Chaos engineering: broker kill, partition leader election, network partition
- [ ] Backup/restore drill (Kafka topic replicate to backup cluster)
- [ ] Runbook: "Kafka broker down", "Consumer lag alert", "Schema evolution"

### Phase 5: Optimization (Ongoing)
- [ ] Tiered storage cost optimization (lifecycle policies)
- [ ] Partition splitting strategy for growth
- [ ] Evaluate Redpanda migration if Kafka ops burden high

---

## References

- ADR-005: Async processing via Celery + Redis
- ADR-003: PostgreSQL RLS for multi-tenancy (audit log source)
- `threat-model.md` §3.2 (Message Injection), §3.5 (DoS)
- `lgpd-compliance-spec.md` §4.2 (Audit logging), §6.3 (Retention)
- Strimzi Operator: https://strimzi.io
- Kafka Tiered Storage: https://kafka.apache.org/documentation/#tieredstorage
- Outbox Pattern: https://microservices.io/patterns/data/transactional-outbox.html
- LGPD Lei 13.709/2018 Art. 46 (Security measures), Art. 16 (Retention)
- Redis Streams vs Kafka: https://redis.io/docs/latest/develop/interact/streams/
- Benchmark: "Message Broker Benchmark 2024" — CloudAMQP/Redpanda/Confluent

---

## Appendix: Topic Design (Initial)

| Topic | Partitions | Retention | Cleanup Policy | Key | Use Case |
|---|---:|---:|---|---|---|
| `learner.events` | 18 | 2 years | delete | `learner_id` | Progress, enrollment, preferences |
| `mastery.events` | 18 | 7 years | compact | `learner_id:skill_id` | BKT/IRT/FSRS state changes (LGPD audit) |
| `audit.logs` | 12 | 7 years | delete | `correlation_id` | Immutable audit trail (Art. 46) |
| `notification.commands` | 6 | 30 days | delete | `learner_id` | Email, push, in-app commands |
| `diagnostic.events` | 6 | 2 years | delete | `session_id` | Placement test events |
| `content.events` | 6 | 1 year | compact | `content_id` | Pack/lesson publish, deprecate |

> Partition count = 6 × broker count (3) = 18 for high-throughput topics. Allows scaling consumers to 18 parallel instances.