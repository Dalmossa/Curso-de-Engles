# ITS Platform — Runbook

**Version:** 0.1.0-draft · **Classification:** Internal
**Source:** `Curso-de-Ingles/ITS-ARCHITECTURE.md` §8, `security-spec.md`, `threat-model.md`
**Audience:** Platform Engineers, SREs, On-Call

---

## 1. Service Overview

| Service | Replicas | Resources | Health Check | SLO |
|---|---|---|---|---|
| `api-gateway` (Kong) | 3 | 500m CPU, 512Mi RAM | `/health` | 99.9% |
| `curriculum-service` | 3 | 1 CPU, 1Gi RAM | `/healthz` | 99.9% |
| `adaptive-engine` | 2 | 2 CPU, 2Gi RAM | `/healthz` | 99.5% |
| `diagnostic-service` | 2 | 1 CPU, 1Gi RAM | `/healthz` | 99.5% |
| `content-service` | 3 | 500m CPU, 512Mi RAM | `/healthz` | 99.9% |
| `assessment-service` | 2 | 1 CPU, 1Gi RAM | `/healthz` | 99.5% |
| `listening-service` | 2 | 1 CPU, 1Gi RAM | `/healthz` | 99.5% |
| `auth-service` | 3 | 500m CPU, 512Mi RAM | `/healthz` | 99.9% |
| `celery-worker` | 3-10 (HPA) | 1 CPU, 1Gi RAM | `celery inspect ping` | N/A |
| `postgresql` (Primary) | 1 | 4 CPU, 16Gi RAM | `pg_isready` | 99.95% |
| `postgresql` (Replica) | 2 | 2 CPU, 8Gi RAM | `pg_isready` | N/A |
| `redis-cluster` | 6 (3M/3R) | 2 CPU, 4Gi RAM | `redis-cli ping` | 99.9% |
| `s3` (Audio) | N/A | N/A | N/A | 99.99% |

---

## 2. Common Procedures

### 2.1 Deploy New Version

```bash
# 1. Verify CI passed
gh run list --workflow=ci --limit=1 --json conclusion

# 2. Build and push image
docker build -t its-platform/api:v1.2.3 .
docker push its-platform/api:v1.2.3

# 3. Update Helm values
helm upgrade its-platform ./helm/its-platform \
  --set api.image.tag=v1.2.3 \
  --set adaptive.image.tag=v1.2.3 \
  --namespace its-platform \
  --wait --timeout 10m

# 4. Verify deployment
kubectl rollout status deployment/api-gateway -n its-platform --timeout=5m
kubectl rollout status deployment/curriculum-service -n its-platform --timeout=5m

# 5. Smoke test
curl -f https://api.its.example.com/v1/health
curl -f https://api.its.example.com/v1/learners/test-user/profile -H "Authorization: Bearer $TEST_TOKEN"
```

### 2.2 Rollback

```bash
# Quick rollback (last revision)
helm rollback its-platform -n its-platform

# Rollback to specific revision
helm history its-platform -n its-platform
helm rollback its-platform <REVISION> -n its-platform

# Verify
kubectl rollout status deployment/api-gateway -n its-platform --timeout=5m
```

### 2.3 Scale Services

```bash
# Manual scale
kubectl scale deployment adaptive-engine --replicas=5 -n its-platform

# HPA is configured for celery-worker based on queue depth
kubectl get hpa celery-worker -n its-platform

# Emergency scale (bypass HPA)
kubectl scale deployment celery-worker --replicas=20 -n its-platform
```

---

## 3. Incident Response Procedures

### 3.1 Severity Levels

| Severity | Definition | Response Time | Escalation |
|---|---|---|---|
| **P1 (Critical)** | Service down, data loss, security breach | 15 min | Page on-call → Team Lead → Director |
| **P2 (High)** | Major feature degraded, SLO breach imminent | 1 hour | Page on-call → Team Lead |
| **P3 (Medium)** | Minor feature degraded, workaround exists | 4 hours | Assign to team |
| **P4 (Low)** | Cosmetic, non-urgent | Next business day | Backlog |

### 3.2 P1: Service Down (API Gateway / All Services)

**Symptoms:** 5xx > 5%, health checks failing, alerts firing

```bash
# 1. Check Kubernetes
kubectl get pods -n its-platform -o wide
kubectl describe pod <failing-pod> -n its-platform
kubectl logs <failing-pod> -n its-platform --tail=100

# 2. Check node resources
kubectl top nodes
kubectl top pods -n its-platform

# 3. Check dependencies
# PostgreSQL
kubectl exec -it postgresql-primary-0 -n its-platform -- pg_isready
# Redis
kubectl exec -it redis-0 -n its-platform -- redis-cli ping
# S3
aws s3 ls s3://its-platform-audio --region us-east-1

# 4. Common fixes
# OOMKilled → increase memory limit
kubectl patch deployment adaptive-engine -p '{"spec":{"template":{"spec":{"containers":[{"name":"adaptive-engine","resources":{"limits":{"memory":"4Gi"}}]}}}}' -n its-platform

# CrashLoopBackOff → check init containers, configmaps
kubectl logs <pod> -n its-platform --previous

# ImagePullBackOff → verify image exists, credentials
kubectl get secret regcred -n its-platform -o yaml
```

### 3.3 P1: Database Issues

**Symptoms:** Slow queries, connection pool exhausted, replication lag

```bash
# 1. Check connections
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  SELECT count(*), state FROM pg_stat_activity GROUP BY state;
"

# 2. Check replication lag
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  SELECT client_addr, state, sync_state, replay_lag FROM pg_stat_replication;
"

# 3. Kill long-running queries
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  SELECT pg_terminate_backend(pid) FROM pg_stat_activity
  WHERE state = 'active' AND now() - query_start > interval '5 minutes'
  AND query NOT LIKE '%pg_stat_activity%';
"

# 4. Connection pool (PgBouncer)
kubectl exec -it pgbouncer-0 -n its-platform -- psql -p 6432 -c "SHOW POOLS;"

# 4. If primary down → promote replica
# (Managed by Patroni/CloudSQL, but verify)
kubectl exec -it postgresql-replica-0 -n its-platform -- pg_ctl promote -D /var/lib/postgresql/data
```

### 3.4 P2: High Latency / SLO Breach

**Symptoms:** p95 > 500ms, p99 > 1s

```bash
# 1. Identify slow endpoint
kubectl exec -it api-gateway-0 -n its-platform -- \
  curl -s http://localhost:8001/metrics | grep http_request_duration_seconds_bucket

# 2. Check database
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  SELECT query, mean_exec_time, calls, rows
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC LIMIT 10;
"

# 3. Check Redis
kubectl exec -it redis-0 -n its-platform -- redis-cli INFO stats | grep instantaneous

# 4. Check Celery queue depth
kubectl exec -it celery-worker-0 -n its-platform -- celery -A its_platform inspect active_queues

# 5. Common fixes
# Missing index
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mastery_learner_skill ON mastery(learner_id, skill_id);
"

# N+1 query in code → deploy fix with query optimization
```

### 3.5 P2: Celery Queue Backlog

**Symptoms:** Queue depth > 1000, tasks not processing

```bash
# 1. Check queue depth
kubectl exec -it celery-worker-0 -n its-platform -- celery -A its_platform inspect active_queues

# 2. Check worker status
kubectl exec -it celery-worker-0 -n its-platform -- celery -A its_platform inspect stats

# 3. Scale workers
kubectl scale deployment celery-worker --replicas=15 -n its-platform

# 4. Check for stuck tasks
kubectl exec -it celery-worker-0 -n its-platform -- celery -A its_platform inspect reserved

# 5. Purge dead letter queue if needed
kubectl exec -it redis-0 -n its-platform -- redis-cli LLEN celery:dlq
```

### 3.6 P1: Security Incident (Data Breach)

**Symptoms:** Unauthorized access alert, anomalous data access, vulnerability exploit

```bash
# 1. Contain
# Revoke all tokens for affected learner(s)
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  UPDATE learners SET last_active_at = now() - interval '1 year'
  WHERE id IN ('<affected_uuids>');
"
# Block IPs at Cloudflare
# Rotate JWT signing keys
kubectl create secret generic jwt-keys --from-file=private.pem=new_private.pem --dry-run=client -o yaml | kubectl apply -f -

# 2. Investigate
# Audit log query
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  SELECT * FROM audit_log
  WHERE learner_id IN ('<affected_uuids>')
  AND timestamp > now() - interval '24 hours'
  ORDER BY timestamp;
"

# 3. Notify (within required timeframes)
# LGPD: DPO + ANPD within 48h
# Learners: within 72h if high risk

# 4. Postmortem (within 5 business days)
# Template: docs/postmortem-template.md
```

---

## 4. Monitoring & Alerting

### 4.1 Key Dashboards (Grafana)

| Dashboard | URL | Key Panels |
|---|---|---|
| **Overview** | `/d/its-overview` | Request rate, error rate, p95 latency, active learners |
| **API Gateway** | `/d/its-api-gateway` | Kong latency, upstream health, rate limit hits |
| **Database** | `/d/its-postgresql` | Connections, replication lag, slow queries, cache hit ratio |
| **Redis** | `/d/its-redis` | Memory, hit rate, evictions, connected clients |
| **Celery** | `/d/its-celery` | Queue depth, task latency, worker count, success rate |
| **Adaptive Engine** | `/d/its-adaptive` | BKT updates/sec, IRT calibrations, FSRS intervals |
| **Security** | `/d/its-security` | Failed logins, token refresh rate, WAF blocks, audit log volume |

### 4.2 Critical Alerts (PrometheusRule)

```yaml
groups:
- name: its-platform-critical
  rules:
  - alert: ServiceDown
    expr: up{job="its-platform"} == 0
    for: 2m
    labels:
      severity: P1
    annotations:
      summary: "{{ $labels.job }} is down"
      runbook: "https://wiki.its.example.com/runbook#p1-service-down"

  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
      /
      sum(rate(http_requests_total[5m])) by (service)
      > 0.05
    for: 5m
    labels:
      severity: P1
    annotations:
      summary: "High error rate on {{ $labels.service }}"
      runbook: "https://wiki.its.example.com/runbook#p1-service-down"

  - alert: HighLatencyP95
    expr: |
      histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))
      > 0.5
    for: 10m
    labels:
      severity: P2
    annotations:
      summary: "High p95 latency on {{ $labels.service }}"
      runbook: "https://wiki.its.example.com/runbook#p2-high-latency"

  - alert: DatabaseConnectionsHigh
    expr: |
      pg_stat_activity_count{state="active"} / pg_settings_max_connections > 0.8
    for: 5m
    labels:
      severity: P2
    annotations:
      summary: "Database connections > 80%"
      runbook: "https://wiki.its.example.com/runbook#p2-database-issues"

  - alert: ReplicationLagHigh
    expr: |
      pg_replication_lag_seconds > 30
    for: 5m
    labels:
      severity: P2
    annotations:
      summary: "PostgreSQL replication lag > 30s"
      runbook: "https://wiki.its.example.com/runbook#p2-database-issues"

  - alert: CeleryQueueBacklog
    expr: |
      celery_queue_length > 1000
    for: 10m
    labels:
      severity: P2
    annotations:
      summary: "Celery queue {{ $labels.queue }} backlog > 1000"
      runbook: "https://wiki.its.example.com/runbook#p2-celery-backlog"

  - alert: FailedLoginsSpike
    expr: |
      rate(auth_failed_logins_total[5m]) > 10
    for: 5m
    labels:
      severity: P2
    annotations:
      summary: "Failed login spike detected"
      runbook: "https://wiki.its.example.com/runbook#p2-security"

  - alert: CertificateExpiring
    expr: |
      ssl_certificate_expiry_days < 30
    for: 1h
    labels:
      severity: P3
    annotations:
      summary: "TLS certificate expires in {{ $value }} days"
      runbook: "https://wiki.its.example.com/runbook#p3-cert-renewal"
```

---

## 5. Backup & Recovery

### 5.1 Backup Schedule

| Data | Frequency | Retention | Tool | RPO | RTO |
|---|---|---|---|---|---|
| PostgreSQL (full) | Daily 02:00 UTC | 30 days | pgBackRest | 24h | 2h |
| PostgreSQL (WAL) | Continuous | 7 days | pgBackRest | < 1min | 2h |
| Redis (RDB) | Every 6 hours | 7 days | Redis snapshots | 6h | 30min |
| S3 (Audio) | Versioning + Cross-region replication | 90 days | S3 lifecycle | 0 | 1h |
| Kubernetes (etcd) | Daily | 30 days | Velero | 24h | 4h |
| Helm values / ConfigMaps | On change | 90 days | GitOps (ArgoCD) | 0 | 30min |

### 5.2 Recovery Procedures

#### 5.2.1 Point-in-Time Recovery (PostgreSQL)

```bash
# 1. Stop writes (scale API to 0)
kubectl scale deployment api-gateway curriculum-service adaptive-engine --replicas=0 -n its-platform

# 2. Restore to target time
pgbackrest --stanza=its-platform --type=time --target-time="2026-10-03 14:30:00" restore

# 3. Verify data integrity
kubectl exec -it postgresql-primary-0 -n its-platform -- psql -c "
  SELECT count(*) FROM learners;
  SELECT max(created_at) FROM practice_attempts;
"

# 4. Restore writes
kubectl scale deployment api-gateway curriculum-service adaptive-engine --replicas=3 -n its-platform
```

#### 5.2.2 Disaster Recovery (Full Region Loss)

```bash
# 1. Deploy to DR region (pre-provisioned)
kubectl config use-context its-platform-dr
helm install its-platform ./helm/its-platform -n its-platform --wait

# 2. Restore PostgreSQL from cross-region backup
pgbackrest --stanza=its-platform --repo=2 restore

# 3. Restore Redis from snapshot
# (Manual: create new cluster from snapshot)

# 4. Update DNS (Route53 failover)
aws route53 change-resource-record-sets --hosted-zone-id Z123456 --change-batch file://failover.json

# 4. Verify
curl -f https://api.its.example.com/v1/health
```

---

## 6. Maintenance Windows

| Activity | Frequency | Window | Duration | Owner |
|---|---|---|---|---|
| Kubernetes version upgrade | Quarterly | Sat 02:00-06:00 UTC | 4h | Platform |
| PostgreSQL minor upgrade | Monthly | Sun 03:00-05:00 UTC | 2h | Platform |
| Redis upgrade | Quarterly | Sun 03:00-05:00 UTC | 1h | Platform |
| Certificate renewal | Automated (cert-manager) | N/A | N/A | Platform |
| Dependency updates | Weekly | Wed 10:00-12:00 UTC | 2h | Platform |
| Schema migrations | Per release | During deploy | < 10min | Backend |
| Load test | Monthly | Tue 14:00-16:00 UTC | 2h | SRE |

---

## 7. On-Call Rotation

| Week | Primary | Secondary | Escalation |
|---|---|---|---|
| 1 | Alice (Platform) | Bob (Adaptive) | Carol (Director) |
| 2 | David (Adaptive) | Eve (Platform) | Carol (Director) |
| 3 | Frank (Backend) | Grace (Platform) | Carol (Director) |
| 4 | Heidi (SRE) | Ivan (Platform) | Carol (Director) |

**Handoff Checklist (Friday 17:00):**
- [ ] Open incidents documented
- [ ] Upcoming deployments noted
- [ ] Known issues / watchlist updated
- [ ] Runbook links verified
- [ ] PagerDuty schedule confirmed

---

## 8. Postmortem Template

```markdown
# Incident Postmortem: INC-YYYYMMDD-XXX

## Summary
- **Date:** YYYY-MM-DD
- **Duration:** Xh Ym
- **Severity:** P1/P2
- **Services Affected:** [list]
- **Impact:** [number] learners affected, [feature] unavailable

## Timeline (UTC)
| Time | Event |
|---|---|
| HH:MM | Alert fired |
| HH:MM | On-call acknowledged |
| HH:MM | Root cause identified |
| HH:MM | Mitigation deployed |
| HH:MM | Service restored |
| HH:MM | All-clear |

## Root Cause
[Technical description — 5 Whys analysis]

## Contributing Factors
1. [Factor 1]
2. [Factor 2]

## Action Items
| ID | Action | Owner | Due Date | Status |
|---|---|---|---|---|
| ACT-001 | [Fix] | [Team] | YYYY-MM-DD | [Open/In Progress/Done] |
| ACT-002 | [Monitoring] | [Team] | YYYY-MM-DD | [Open/In Progress/Done] |
| ACT-003 | [Process] | [Team] | YYYY-MM-DD | [Open/In Progress/Done] |

## Lessons Learned
- [What went well]
- [What didn't go well]
- [What to improve]

## Links
- Grafana snapshot: [URL]
- Logs: [URL]
- Deploy: [URL]
```

---

## 9. Useful Commands Quick Reference

```bash
# Pod logs (last 100 lines, follow)
kubectl logs -f deployment/<service> -n its-platform --tail=100

# Exec into pod
kubectl exec -it <pod> -n its-platform -- /bin/bash

# Port forward (local access)
kubectl port-forward svc/postgresql-primary 5432:5432 -n its-platform
kubectl port-forward svc/redis 6379:6379 -n its-platform

# ConfigMap / Secret
kubectl get configmap its-platform-config -n its-platform -o yaml
kubectl get secret its-platform-secrets -n its-platform -o yaml

# Events (recent)
kubectl get events -n its-platform --sort-by='.lastTimestamp' | tail -20

# Resource usage
kubectl top pods -n its-platform --sort-by=memory
kubectl top nodes

# Helm
helm list -n its-platform
helm get values its-platform -n its-platform
helm template its-platform ./helm/its-platform -n its-platform | head -100

# ArgoCD (if using GitOps)
argocd app get its-platform
argocd app sync its-platform
```

---

## 10. Contacts

| Role | Name | Slack | Phone (Emergency) |
|---|---|---|---|
| Platform Lead | Alice | @alice | +55 11 9xxxx-xxxx |
| Adaptive Lead | David | @david | +55 11 9xxxx-xxxx |
| Backend Lead | Frank | @frank | +55 11 9xxxx-xxxx |
| Security Lead | Carol | @carol | +55 11 9xxxx-xxxx |
| DPO | Maria | @maria | +55 11 9xxxx-xxxx |
| AWS Support | Enterprise | N/A | Case in Console |

---

*Keep this runbook updated. Every incident should improve it.*