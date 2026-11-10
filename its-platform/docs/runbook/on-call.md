# On-Call Rotation & Runbook — P2.11

**Version:** 1.0 | **Last Updated:** 2026-11-10 | **Review Cycle:** Quarterly

---

## 1. On-Call Rotation Schedule

### 1.1 Rotation Schedule (4-Week Cycle)

| Week | Primary On-Call | Backup | Timezone Coverage |
|------|-----------------|--------|-------------------|
| Week 1 | @dev-1 | @dev-2 | UTC-3 (BRT) |
| Week 2 | @dev-3 | @dev-4 | UTC-3 (BRT) |
| Week 3 | @dev-5 | @dev-1 | UTC-3 (BRT) |
| Week 4 | @dev-2 | @dev-3 | UTC-3 (BRT) |

### 1.2 Handoff Procedure (Every Monday 09:00 BRT)

1. **Outgoing on-call** posts in `#on-call-handoff`:
   - Active incidents (link to Slack thread / GitHub issue)
   - Recent deployments (links)
   - Known issues / watch items
   - Upcoming maintenance windows

2. **Incoming on-call** acknowledges and confirms:
   - Access to all systems (kubectl, ArgoCD, Grafana, PagerDuty)
   - Current on-call phone/laptop with alerts configured
   - Escalation contacts updated in PagerDuty

3. **Handoff doc** updated in Confluence/wiki with timestamp

### 1.3 Escalation Policy

| Severity | Initial Response | Escalation After | Escalation To |
|----------|------------------|------------------|---------------|
| P1 (Critical) | 15 min | 30 min | Platform Lead → SRE Lead |
| P2 (High) | 1 hour | 2 hours | SRE Lead → Platform Lead |
| P3 (Medium) | 4 hours | 8 hours | Platform Lead |
| P4 (Low) | Next business day | — | Backlog |

---

## 2. On-Call Responsibilities

### 2.1 Primary On-Call
- Acknowledge P1 alerts within 15 min (PagerDuty)
- Acknowledge P2 alerts within 1 hour (Slack)
- Own incident until resolution or escalation
- Post-incident review within 48h for P1/P2

### 2.2 Backup On-Call
- Available if primary doesn't respond within escalation window
- Can take over if primary is unavailable
- Reviews handoff notes daily

### 2.3 Platform Lead
- Final escalation point
- Authorizes production rollbacks
- Approves emergency maintenance windows

---

## 3. Alert Routing (Alertmanager)

### 3.1 Route Configuration

```yaml
route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    - match:
        severity: P1
      receiver: 'p1-pager'
      continue: true
    - match:
        severity: P2
      receiver: 'p2-slack'
    - match:
        severity: P3
      receiver: 'p3-email'
```

### 3.2 Receivers

| Receiver | Channel | Severity | Escalation |
|----------|---------|----------|------------|
| `p1-pager` | PagerDuty | P1 | Immediate page, repeat every 5 min |
| `p2-slack` | Slack #incidents | P2 | Slack @on-call, repeat every 30 min |
| `p3-email` | Email | P3 | Email to team, no repeat |

### 3.3 Inhibition Rules

```yaml
inhibit_rules:
  - source_match:
      severity: 'P1'
    target_match_re:
      severity: 'P[23]'
    equal: ['alertname', 'namespace']
```

---

## 4. Incident Response Playbooks

### 4.1 P1 — Service Down
**Alert:** `ServiceDown` (up == 0 for 2m)

1. **Acknowledge** in PagerDuty within 15 min
2. **Check** ArgoCD: `argocd app get its-platform-prod`
3. **Check** pod status: `kubectl get pods -n its-platform-prod`
4. **Check** Kong: `kubectl logs -n kong deployment/kong -f`
5. **If DB issue**: Check connections, replication lag
6. **Escalate** to Platform Lead if not resolved in 30 min

### 4.2 P2 — High Error Rate
**Alert:** `HighErrorRate` (5xx > 5% for 5m)

1. **Check** Kong logs: `kubectl logs -n kong deployment/kong -f | grep " 5.. "`
2. **Check** API logs: `kubectl logs -n its-platform-prod deploy/its-platform -f | grep ERROR`
3. **Check** DB: `psql -c "SELECT count(*) FROM pg_stat_activity;"`
4. **Scale** if needed: `kubectl scale deploy its-platform --replicas=10 -n its-platform-prod`

### 4.3 P2 — High Latency
**Alert:** `HighLatencyP95` (p95 > 500ms for 10m)

1. **Check** HPA: `kubectl get hpa -n its-platform-prod`
2. **Check** DB: `psql -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"`
3. **Check** Kong upstream: `curl -s kong-admin:8001/metrics | grep kong_latency`

### 4.4 P2 — Database Connections High
**Alert:** `DatabaseConnectionsHigh` (active > 80% max)

```bash
# Check current vs max
psql -c "SELECT count(*) as current, setting as max FROM pg_stat_activity, pg_settings WHERE name = 'max_connections';"

# Kill idle > 5 min
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND now() - state_change > interval '5 minutes';"

# Scale pgbouncer
kubectl scale deployment pgbouncer --replicas=5 -n its-platform-prod
```

### 4.3 P2 — Replication Lag
**Alert:** `ReplicationLagHigh` (lag > 30s)

```bash
# Check replica status
psql -c "SELECT * FROM pg_stat_replication;"

# Check WAL receiver
psql -c "SELECT * FROM pg_stat_wal_receiver;"
```

---

## 5. Post-Incident Process

### 5.1 Timeline
| Phase | Deadline |
|-------|----------|
| Incident resolved | — |
| Draft postmortem | 24 hours |
| Review meeting | 48 hours |
| Action items assigned | 72 hours |

### 5.2 Postmortem Template
```markdown
# Incident Postmortem: [INC-XXXX]

## Summary
- **Date:** YYYY-MM-DD
- **Duration:** Xh Ym
- **Severity:** P1/P2/P3
- **Impact:** X users affected, Y% error rate

## Timeline
- HH:MM — Detection (alert fired)
- HH:MM — Acknowledged by on-call
- HH:MM — Root cause identified
- HH:MM — Mitigation deployed
- HH:MM — Resolved

## Root Cause
[5 Whys analysis]

## Action Items
| ID | Action | Owner | Due Date | Status |
|----|--------|-------|----------|--------|
| 1 | Fix root cause | @dev-x | YYYY-MM-DD | Open |
| 2 | Add alert for early detection | @dev-y | YYYY-MM-DD | Open |

## Links
- Slack thread: [link]
- GitHub issue: [link]
- Grafana snapshot: [link]
```

---

## 6. Communication Channels

| Channel | Purpose | Members |
|---------|---------|---------|
| `#on-call-handoff` | Weekly handoff notes | All on-call |
| `#incidents` | Active incident coordination | On-call + leads |
| `#alerts` | Alertmanager notifications | All engineers |
| `#deployments` | Deployment notifications | All engineers |

---

## 7. Escalation Contacts

| Role | Name | Slack | PagerDuty | Email | Phone |
|------|------|-------|-----------|-------|-------|
| Platform Lead | [Name] | @platform-lead | platform-lead | lead@its.example.com | +55 11 9xxxx-xxxx |
| SRE Lead | [Name] | @sre-lead | sre-lead | sre@its.example.com | +55 11 9xxxx-xxxx |
| DB Admin | [Name] | @db-admin | db-admin | db@its.example.com | +55 11 9xxxx-xxxx |
| Security Lead | [Name] | @security-lead | security-lead | sec@its.example.com | +55 11 9xxxx-xxxx |

---

## 8. Useful Commands Quick Reference

```bash
# ArgoCD
argocd app sync its-platform-prod --prune
argocd app rollback its-platform-prod <revision>

# Kubernetes
kubectl logs -n its-platform-prod -l app=its-platform -f --tail=100
kubectl exec -n its-platform-prod -it deploy/its-platform -- sh
kubectl port-forward -n its-platform-prod svc/postgresql 5432:5432

# Database
kubectl port-forward -n its-platform-prod svc/postgresql 5432:5432
psql -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"

# Kong
curl -s kong-admin:8001/metrics | grep rate_limit

# pgBackRest
pgbackrest --stanza=prod info

# ArgoCD rollback
argocd app rollback its-platform-prod <revision>
```

---

*Last updated: 2026-11-10 | Next review: 2027-02-10 | Owner: Platform Lead*
