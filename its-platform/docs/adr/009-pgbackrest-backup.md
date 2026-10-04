---
adr: 009
title: pgBackRest for PostgreSQL backup
status: Accepted
date: 2026-10-03
authors: [@platform-lead, @db-admin]
deciders: [@platform-lead, @db-admin, @sre-lead]
consulted: [@security-lead]
informed: [@team]
tags: [postgresql, backup, pgbackrest, disaster-recovery]
---

## Context

PostgreSQL 16 is the primary datastore for the ITS Platform. Backup requirements:

| Requirement | Target |
|---|---|
| **RPO (Recovery Point Objective)** | < 1 minute (continuous WAL archiving) |
| **RTO (Recovery Time Objective)** | < 2 hours (full restore) |
| **Retention** | 30 days full + 7 days WAL (prod); 7 days full + 1 day WAL (dev/staging) |
| **Encryption** | AES-256 at rest, in transit |
| **Compression** | zstd level 3 |
| **Verification** | Automated restore test weekly |
| **Cross-region** | DR replica in us-west-2 |

Alternatives: pgBackRest, Barman, pg_basebackup + WAL-G, AWS RDS automated backups, EBS snapshots.

## Decision

**Use pgBackRest 2.50+ for PostgreSQL backup and restore.**

### Why pgBackRest?

| Feature | pgBackRest | Barman | WAL-G | RDS Auto | EBS Snapshots |
|---|---|---|---|---|---|
| Parallel backup | ✅ | ✅ | ✅ | ✅ | N/A |
| Incremental backup | ✅ | ✅ | ❌ | ✅ | ❌ |
| Parallel restore | ✅ | ❌ | ✅ | ❌ | N/A |
| Delta restore | ✅ | ❌ | ❌ | ❌ | N/A |
| S3/GCS/Azure | ✅ | ✅ | ✅ | N/A | N/A |
| Encryption | ✅ | ✅ | ✅ | ✅ | ✅ |
| Compression (zstd) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Page checksums | ✅ | ✅ | ✅ | ✅ | ❌ |
| Backup from standby | ✅ | ✅ | ✅ | N/A | N/A |
| Point-in-time recovery | ✅ | ✅ | ✅ | ✅ | ❌ |
| Single binary | ✅ | ❌ | ✅ | N/A | N/A |

### Configuration

```ini
# /etc/pgbackrest/pgbackrest.conf
[global]
repo1-type=s3
repo1-path=/its-platform-backups/prod
repo1-s3-bucket=its-platform-pgbackrest
repo1-s3-region=us-east-1
repo1-s3-endpoint=s3.us-east-1.amazonaws.com
repo1-s3-key=xxxx
repo1-s3-key-secret=xxxx
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass=xxxx
compress-type=zstd
compress-level=3
process-max=4
buffer-size=2MB
log-level-console=info
log-level-file=debug

[global:archive]
repo1-retention-full=30
repo1-retention-diff=7
repo1-retention-archive=7

[global:archive-push]
archive-timeout=60
archive-queue-max=100MB

[prod]
pg1-path=/var/lib/postgresql/16/main
pg1-port=5432
pg1-host=localhost
```

### Backup Schedule (cron)

```bash
# Full backup daily at 02:00 UTC
0 2 * * * pgbackrest --stanza=prod --type=full backup

# Differential backup every 6 hours
0 */6 * * * pgbackrest --stanza=prod --type=diff backup

# WAL archiving continuous (configured in postgresql.conf)
# archive_command = 'pgbackrest --stanza=prod archive-push %p'
```

### Restore Procedures

```bash
# Point-in-time recovery (PITR)
pgbackrest --stanza=prod --type=time --target-time="2026-10-03 14:30:00" restore

# Delta restore (only changed blocks) - fastest
pgbackrest --stanza=prod --type=time --target-time="2026-10-03 14:30:00" --delta restore

# Full restore (new cluster)
pgbackrest --stanza=prod --type=full restore
```

### Kubernetes Integration (Sidecar)

```yaml
# Deployment patch for pgBackRest sidecar
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgresql
spec:
  template:
    spec:
      containers:
        - name: pgbackrest
          image: ghcr.io/pgbackrest/pgbackrest:2.50
          command: ["/bin/bash", "-c", "pgbackrest --stanza=prod --log-level-console=info server"]
          env:
            - name: PGBACKREST_CONFIG
              value: /etc/pgbackrest/pgbackrest.conf
            - name: AWS_ACCESS_KEY_ID
              valueFrom:
                secretKeyRef:
                  name: pgbackrest-s3
                  key: access-key
            - name: AWS_SECRET_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: pgbackrest-s3
                  key: secret-key
          volumeMounts:
            - name: pgdata
              mountPath: /var/lib/postgresql/16/main
            - name: pgbackrest-config
              mountPath: /etc/pgbackrest
            - name: pgbackrest-spool
              mountPath: /var/spool/pgbackrest
      volumes:
        - name: pgbackrest-config
          configMap:
            name: pgbackrest-config
        - name: pgbackrest-spool
          emptyDir: {}
```

### Verification (Automated)

```bash
# Weekly restore test (CI/CD)
# 1. Create temporary cluster
# 2. pgbackrest --stanza=prod --type=time --target-time="<now-1h>" --delta restore
# 3. Run integrity checks
#    - pg_verify_checksums
#    - SELECT count(*) FROM learners;
#    - SELECT count(*) FROM mastery;
# 4. Verify data freshness
#    - max(created_at) FROM practice_attempts > now() - 2h
# 5. Cleanup
```

## Consequences

### Positive
- **Best-in-class** — parallel, incremental, delta restore, page checksums
- **Single binary** — easy deployment, no Python/Java deps
- **S3 native** — no NFS, no mount points
- **Delta restore** — fastest RTO for small changes
- **Standby backup** — no load on primary
- **Open source** — no vendor lock-in

### Negative
- **Learning curve** — many options, stanza concept
- **Spool directory** — needs space for WAL staging (~10% of DB)
- **Not managed service** — we operate it (sidecar or external)

### Neutral
- **RDS not used** — we run self-managed PostgreSQL on EKS for RLS control

## Alternatives Considered

1. **AWS RDS Automated Backups** — No PITR to arbitrary second, no delta restore, no cross-region without Aurora Global
2. **EBS Snapshots** — Crash-consistent only, no PITR, slow restore, no compression
3. **WAL-G** — Good but no incremental backup, no delta restore, less mature
4. **Barman** — Python-based, slower, no parallel restore
5. **pg_basebackup + custom scripts** — Reinventing pgBackRest poorly

## Implementation Plan

- [x] Add pgBackRest sidecar to PostgreSQL StatefulSet
- [x] Configure S3 repo with KMS encryption
- [x] Set up continuous WAL archiving (`archive_command`)
- [x] Schedule full (daily) + differential (6h) backups
- [x] Configure retention: 30d full / 7d diff / 7d WAL
- [x] Implement weekly automated restore test in CI
- [ ] Cross-region replication to us-west-2 (repo2)
- [ ] Document PITR runbook in `runbook.md` §5.2.1
- [ ] Alert on: backup failure, WAL lag > 5min, repo size growth

## References

- `runbook.md` §5 — Backup & Recovery
- `threat-model.md` §3.5 — DoS D-03
- `iac-spec.md` §5 — DR cross-region
- pgBackRest docs: https://pgbackrest.org
- PostgreSQL PITR: https://www.postgresql.org/docs/current/backup-pitr.html