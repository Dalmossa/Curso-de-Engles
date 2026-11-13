# ITS Platform — Runbook

**Version:** 1.0 | **Last Updated:** 2026-10-16

---

## 1. Service Overview

| Service | Port | Protocol | Health Check |
|---------|------|----------|--------------|
| its-platform-api | 3000 | HTTP | GET /health, GET /ready |
| PostgreSQL | 5432 | TCP | pg_isready |
| Redis | 6379 | TCP | PING |
| Kong | 8000/8443 | HTTP/HTTPS | GET /health |

---

## 2. Deployment Procedures

### 2.1 Standard Deploy (Dev/Staging)
```bash
# Auto-synced via ArgoCD on push to main (dev) or staging-* tag (staging)
# Manual trigger if needed:
kubectl -n argocd patch app its-platform-dev -p '{"operation":{"initiatedBy":{"username":"manual"}}}' --type merge
```

### 2.2 Production Deploy
```bash
# 1. Create and push version tag
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3

# 2. ArgoCD UI: its-platform-prod → Sync → Manual approval required
# 3. Monitor: kubectl -n its-platform-prod rollout status deploy/its-platform
```

### 2.3 Rollback
```bash
# Via ArgoCD UI: its-platform-prod → History → Rollback to previous version
# Or CLI:
kubectl -n its-platform-prod rollout undo deploy/its-platform
```

---

## 3. Backup & Recovery (pgBackRest) — P2.6

### 3.1 Backup Architecture

| Component | Schedule | Retention |
|-----------|----------|-----------|
| Full backup | Daily 02:00 UTC | 30 days |
| Differential | Every 6 hours | 7 days |
| WAL archiving | Continuous | 7 days |

### 3.1.1 Backup Repository Setup (S3 + KMS)

#### S3 Provider Selection
| Environment | Provider | Bucket | Region |
|-------------|----------|--------|--------|
| dev | MinIO (local) | its-platform-pgbackrest-dev | local |
| staging | AWS S3 | its-platform-pgbackrest-staging | us-east-1 |
| prod | AWS S3 | its-platform-pgbackrest-prod | us-east-1 |

#### S3 Bucket Configuration
```bash
# Create bucket with versioning
aws s3api create-bucket \
  --bucket its-platform-pgbackrest-prod \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket its-platform-pgbackrest-prod \
  --versioning-configuration Status=Enabled

# Enable server-side encryption with KMS
aws s3api put-bucket-encryption \
  --bucket its-platform-pgbackrest-prod \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "arn:aws:kms:us-east-1:123456789012:key/xxx"
      }
    }]
  }'
```

#### KMS Key Configuration
```bash
# Create KMS key with automatic rotation (90 days)
aws kms create-key \
  --description "pgBackRest backup encryption key for its-platform" \
  --key-usage ENCRYPT_DECRYPT \
  --origin AWS_KMS \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "Allow pgBackRest role",
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:role/pgbackrest-role"},
      "Action": ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"],
      "Resource": "*"
    }]
  }'
```

#### IAM Policy for pgBackRest
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "pgBackRestBucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::its-platform-pgbackrest-*",
        "arn:aws:s3:::its-platform-pgbackrest-*/*"
      ]
    },
    {
      "Sid": "KMSKeyUsage",
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ],
      "Resource": "arn:aws:kms:us-east-1:123456789012:key/xxx"
    }
  ]
}
```

#### Kubernetes Secret Creation
```bash
# Create secret for each environment
kubectl create secret generic its-platform-pgbackrest-s3 \
  --namespace its-platform-prod \
  --from-literal=access-key=<AWS_ACCESS_KEY_ID> \
  --from-literal=secret-key=<AWS_SECRET_ACCESS_KEY> \
  --from-literal=endpoint=s3.us-east-1.amazonaws.com
```

### 3.2 Backup Status Check
```bash
# Check backup status
pgbackrest --stanza=prod info

# Check last backup times
pgbackrest --stanza=prod info --output=json | jq '.[0].backup'
```

### 3.3 Point-in-Time Recovery (PITR)

#### 3.3.1 Standard PITR
```bash
# Restore to specific timestamp
pgbackrest --stanza=prod \
  --type=time \
  --target-time="2026-10-16 14:30:00" \
  --log-level-console=info \
  restore
```

#### 3.3.2 Delta Restore (Fastest for Small Changes)
```bash
# Only restore changed blocks - use when DB exists
pgbackrest --stanza=prod \
  --type=time \
  --target-time="2026-10-16 14:30:00" \
  --delta \
  --log-level-console=info \
  restore
```

#### 3.3.3 Full Restore (New Cluster)
```bash
# Fresh cluster, no existing data
pgbackrest --stanza=prod \
  --type=full \
  --log-level-console=info \
  restore
```

### 3.4 Recovery Validation
```bash
# After restore, verify:
# 1. Page checksums
pg_verify_checksums -D /var/lib/postgresql/16/main

# 2. Row counts on critical tables
psql -c "SELECT count(*) FROM learners;"
psql -c "SELECT count(*) FROM learner_mastery;"
psql -c "SELECT count(*) FROM practice_attempts;"
psql -c "SELECT count(*) FROM diagnostic_results;"

# 3. Data freshness
psql -c "SELECT max(completed_at) FROM practice_attempts;"
# Should be within 2 hours of restore target time
```

### 3.5 Cross-Region DR (us-west-2)
```bash
# Restore from cross-region repo (repo2)
pgbackrest --stanza=prod --repo=2 \
  --type=time --target-time="2026-10-16 14:30:00" \
  --delta restore
```

---

## 4. Observability & Alerting — P2.7

### 4.1 Key Dashboards (Grafana)
| Dashboard | URL | Purpose |
|-----------|-----|---------|
| ITS Platform Overview | /d/its-platform-overview | Request rate, error rate, latency p95, active learners |
| Database | /d/its-platform-db | Connections, replication lag, query latency |
| Kong Gateway | /d/kong-gateway | Rate limit hits, latency, upstream health |
| Adaptive Engine | /d/adaptive-engine | BKT/IRT/FSRS metrics, queue depth |

### 4.2 Critical Alerts (Alertmanager)

| Alert | Severity | Condition | Runbook |
|-------|----------|-----------|---------|
| ServiceDown | P1 | up == 0 for 2m | §5.1 |
| HighErrorRate | P1 | 5xx rate > 5% for 5m | §5.2 |
| HighLatencyP95 | P2 | p95 > 500ms for 10m | §5.3 |
| DatabaseConnectionsHigh | P2 | active > 80% max | §5.4 |
| ReplicationLagHigh | P2 | lag > 30s | §5.5 |
| FailedLoginsSpike | P2 | > 10/min for 5m | §5.6 |
| CertificateExpiring | P3 | expiry < 30 days | §5.7 |

### 4.3 Log Queries (Loki)
```logql
# All errors in last hour
{namespace="its-platform-*"} |= "error" |~ "ERROR|FATAL"

# Slow requests (>1s)
{namespace="its-platform-*"} | json | duration > 1000000000

# Specific learner errors
{namespace="its-platform-*"} | json | learner_id="uuid-here"
```

### 4.4 Trace Queries (Tempo)
```traceql
# High latency traces
{.service.name="its-platform-api"} && duration > 500ms

# Errors with stack traces
{.service.name="its-platform-api"} && .span.status.code = ERROR
```

---

## 5. Database Operations

### 5.1 Connection Pool Monitoring
```bash
# Active connections
psql -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"

# Long running queries (>30s)
psql -c "SELECT pid, now() - query_start as duration, query FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '30 seconds';"

# Blocking queries
psql -c "SELECT blocked_locks.pid AS blocked_pid, blocking_locks.pid AS blocking_pid FROM pg_catalog.pg_locks blocked_locks JOIN pg_catalog.pg_locks blocking_locks ON blocked_locks.locktype = blocking_locks.locktype AND blocked_locks.database IS NOT DISTINCT FROM blocking_locks.database AND blocked_locks.relation IS NOT DISTINCT FROM blocking_locks.relation AND blocked_locks.page IS NOT DISTINCT FROM blocking_locks.page AND blocked_locks.tuple IS NOT DISTINCT FROM blocking_locks.tuple WHERE NOT blocked_locks.granted AND blocking_locks.granted;"
```

### 5.2 Vacuum & Analyze
```bash
# Manual vacuum on large tables
psql -c "VACUUM (ANALYZE, VERBOSE) practice_attempts;"
psql -c "VACUUM (ANALYZE, VERBOSE) learner_mastery;"

# Check bloat
psql -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(relid)) as size, pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as bloat FROM pg_catalog.pg_stat_user_tables WHERE n_dead_tup > 1000 ORDER BY pg_total_relation_size(relid) DESC LIMIT 20;"
```

---

## 6. Incident Response

### 6.1 Severity Levels
| Severity | Response Time | Escalation |
|----------|---------------|------------|
| P1 (Critical) | 15 min | Page on-call + Slack #incidents |
| P2 (High) | 1 hour | Slack #incidents + email |
| P3 (Medium) | 4 hours | Slack #incidents |
| P4 (Low) | Next business day | GitHub issue |

### 6.2 Common Incidents

#### 6.2.1 High Error Rate (5xx > 5%)
1. Check Kong logs: `kubectl logs -n kong deployment/kong -f`
2. Check API logs: `kubectl logs -n its-platform-prod deployment/its-platform -f`
3. Check DB connections: `psql -c "SELECT count(*) FROM pg_stat_activity;"`
4. If DB exhausted: scale up pgbouncer or kill long queries

#### 6.2.2 High Latency (p95 > 500ms)
1. Check HPA: `kubectl get hpa -n its-platform-prod`
2. Check DB query latency: `psql -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"`
3. Check Kong upstream latency: `curl -s kong-admin:8001/metrics | grep kong_latency`

#### 6.2.3 Database Connection Exhaustion
```bash
# Check current vs max
psql -c "SELECT count(*) as current, setting as max FROM pg_stat_activity, pg_settings WHERE name = 'max_connections';"

# Kill idle connections > 5 min
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND now() - state_change > interval '5 minutes';"

# Scale pgbouncer
kubectl scale deployment pgbouncer --replicas=5 -n its-platform-prod
```

#### 6.2.4 Replication Lag > 30s
```bash
# Check replica status
psql -c "SELECT * FROM pg_stat_replication;"

# Check WAL receiver
psql -c "SELECT * FROM pg_stat_wal_receiver;"

# If replica down, promote or rebuild
```

---

## 6.3 Security Incidents

### 6.3.1 Failed Login Spike
1. Check Kong auth plugin logs
2. Check rate limit hits: `curl -s kong-admin:8001/metrics | grep rate_limit`
3. Consider temporary IP block via Kong ACL plugin

### 6.3.2 Certificate Expiring
```bash
# Check cert expiry
kubectl get cert -A -o custom-columns=NAME:.metadata.name,EXPIRY:.status.notAfter

# Renew manually if cert-manager stuck
kubectl delete secret its-platform-tls -n its-platform-prod
# cert-manager will re-issue
```

---

## 7. Scaling Procedures

### 7.1 Horizontal Scaling (HPA)
```bash
# Check HPA status
kubectl get hpa -n its-platform-prod

# Manual scale (emergency)
kubectl scale deployment its-platform --replicas=10 -n its-platform-prod
```

### 7.2 Database Vertical Scaling
```bash
# Requires downtime - plan maintenance window
# 1. Stop API: kubectl scale deploy its-platform --replicas=0
# 2. Update PostgreSQL resources
# 3. Restart PostgreSQL
# 4. Start API: kubectl scale deploy its-platform --replicas=3
```

---

## 8. Maintenance Windows

| Window | Frequency | Duration | Activities |
|--------|-----------|----------|------------|
| Daily | 02:00-04:00 UTC | 2h | Full backup, vacuum analyze |
| Weekly | Sunday 04:00 UTC | 4h | Restore test, index rebuild |
| Monthly | 1st Saturday 06:00 UTC | 8h | PostgreSQL minor upgrade, cert rotation, DR drill |

---

## 9. Contacts & Escalation

| Role | Primary | Backup |
|------|---------|--------|
| Platform Lead | @platform-lead | @sre-lead |
| Database Admin | @db-admin | @platform-lead |
| Security Lead | @security-lead | @platform-lead |
| On-Call (Week 1) | @dev-1 | @dev-2 |
| On-Call (Week 2) | @dev-3 | @dev-4 |
| On-Call (Week 3) | @dev-5 | @dev-1 |
| On-Call (Week 4) | @dev-2 | @dev-3 |

---

## 10. Useful Commands Quick Reference

```bash
# Pod logs
kubectl logs -n its-platform-prod -l app=its-platform -f --tail=100

# Exec into pod
kubectl exec -n its-platform-prod -it deploy/its-platform -- sh

# Port forward DB
kubectl port-forward -n its-platform-prod svc/postgresql 5432:5432

# Check Kong config
curl -s kong-admin:8001/metrics | grep rate_limit

# pgBackRest info
pgbackrest --stanza=prod info

# ArgoCD sync
argocd app sync its-platform-prod --prune

# Force rollback
argocd app rollback its-platform-prod <revision>
```

---

*Last reviewed: 2026-10-16 | Next review: 2026-11-16*
