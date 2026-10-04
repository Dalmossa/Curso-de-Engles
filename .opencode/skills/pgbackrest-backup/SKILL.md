---
name: pgBackRest Backup
description: pgBackRest configuration for PostgreSQL backup, PITR, cross-region replication
---

# pgBackRest Backup Skill — ITS Platform

## When to Use
- Configuring PostgreSQL backup strategy
- Point-in-time recovery (PITR)
- Cross-region disaster recovery
- Automated restore testing

## Configuration

### pgBackRest Config
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

### Cross-Region Replication (Repo2)
```ini
[global]
repo2-type=s3
repo2-path=/its-platform-backups/dr
repo2-s3-bucket=its-platform-pgbackrest-dr
repo2-s3-region=us-west-2
repo2-s3-endpoint=s3.us-west-2.amazonaws.com
repo2-cipher-type=aes-256-cbc
```

### Backup Schedule (cron)
```bash
# Full backup daily at 02:00 UTC
0 2 * * * pgbackrest --stanza=prod --type=full backup

# Differential backup every 6 hours
0 */6 * * * pgbackrest --stanza=prod --type=diff backup

# WAL archiving continuous (postgresql.conf)
# archive_command = 'pgbackrest --stanza=prod archive-push %p'
```

### Kubernetes Sidecar Deployment
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

## Restore Procedures

### Point-in-Time Recovery (PITR)
```bash
# Restore to specific timestamp
pgbackrest --stanza=prod --type=time --target-time="2026-10-03 14:30:00" restore

# Delta restore (fastest for small changes)
pgbackrest --stanza=prod --type=time --target-time="2026-10-03 14:30:00" --delta restore

# Full restore (new cluster)
pgbackrest --stanza=prod --type=full restore
```

### Cross-Region DR Restore
```bash
# Restore from cross-region repo
pgbackrest --stanza=prod --repo=2 --type=time --target-time="2026-10-03 14:30:00" --delta restore
```

### Automated Weekly Restore Test
```bash
#!/bin/bash
# weekly-restore-test.sh
set -e

TIMESTAMP=$(date -d "1 hour ago" "+%Y-%m-%d %H:%M:%S")
TEMP_DIR="/tmp/pgbackrest-restore-test-$(date +%s)"

# 1. Create temporary cluster
initdb -D "$TEMP_DIR" --auth=trust

# 2. Restore to 1 hour ago (delta)
pgbackrest --stanza=prod --type=time --target-time="$TIMESTAMP" --delta --target-path="$TEMP_DIR" restore

# 3. Start PostgreSQL
pg_ctl -D "$TEMP_DIR" -l "$TEMP_DIR/logfile" start

# 4. Run integrity checks
psql -d postgres -c "SELECT pg_verify_checksums();"
psql -d its_platform -c "SELECT count(*) FROM learners;"
psql -d its_platform -c "SELECT count(*) FROM mastery;"
psql -d its_platform -c "SELECT max(created_at) FROM practice_attempts;"

# 5. Verify data freshness
psql -d its_platform -c "
  SELECT 
    max(created_at) > now() - interval '2 hours' as practice_recent,
    max(created_at) > now() - interval '24 hours' as mastery_recent
  FROM practice_attempts, mastery;
"

# 6. Cleanup
pg_ctl -D "$TEMP_DIR" stop
rm -rf "$TEMP_DIR"

echo "Restore test PASSED"
```

## Monitoring & Alerting

```yaml
# Prometheus alerts
- alert: BackupFailed
  expr: pgbackrest_backup_failed_total > 0
  for: 5m
  labels:
    severity: P1
  annotations:
    summary: "pgBackRest backup failed"

- alert: WALLagHigh
  expr: pg_wal_lag_bytes > 1073741824  # 1GB
  for: 5m
  labels:
    severity: P2
  annotations:
    summary: "WAL archiving lag > 1GB"

- alert: BackupRepoSizeGrowth
  expr: increase(pgbackrest_repo_size_bytes[24h]) > 10737418240  # 10GB/day
  for: 1h
  labels:
    severity: P3
  annotations:
    summary: "Backup repository growing rapidly"
```

## Validation Checklist
- [ ] Full backup daily, differential every 6h, continuous WAL
- [ ] Retention: 30d full / 7d diff / 7d WAL (prod)
- [ ] AES-256 encryption with KMS
- [ ] zstd compression level 3
- [ ] Cross-region replication to us-west-2
- [ ] Weekly automated restore test in CI
- [ ] PITR tested and documented
- [ ] Delta restore for fast RTO
- [ ] Alerts on backup failure, WAL lag, repo growth