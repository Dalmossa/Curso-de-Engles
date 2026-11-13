# ITS Platform Helm Chart

Helm chart for deploying the ITS Platform (Intelligent Tutoring System) to Kubernetes.

## Prerequisites

- Kubernetes 1.28+
- Helm 3.12+
- NGINX Ingress Controller
- cert-manager (for TLS certificates)
- Prometheus Operator (for ServiceMonitor)
- SealedSecrets Controller or External Secrets Operator (for secret management)

## Chart Structure

```
iac/helm/its-platform/
├── Chart.yaml
├── values.yaml              # Default values
├── values-dev.yaml          # Development environment overrides
├── values-staging.yaml      # Staging environment overrides
├── values-prod.yaml         # Production environment overrides
├── README.md                # This file
└── templates/
    ├── _helpers.tpl
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    ├── secret.yaml
    ├── hpa.yaml
    ├── networkpolicy.yaml
    ├── pdb.yaml
    ├── serviceaccount.yaml
    ├── servicemonitor.yaml
    ├── postgresql-configmap.yaml
    ├── postgresql-statefulset.yaml
    ├── pgbackrest/
    │   ├── configmap.yaml
    │   ├── secret.yaml
    │   └── sidecar.yaml
    └── monitoring/
        ├── alertmanager.yaml
        ├── grafana-dashboards.yaml
        ├── loki.yaml
        ├── otel-collector.yaml
        ├── prometheus.yaml
        └── tempo.yaml
```

## Installation

### Add the chart repository (if published)

```bash
helm repo add its-platform https://charts.its-platform.example.com
helm repo update
```

### Install from local source

```bash
# Development
helm install its-platform ./iac/helm/its-platform \
  -f ./iac/helm/its-platform/values-dev.yaml \
  -n its-platform-dev --create-namespace

# Staging
helm install its-platform ./iac/helm/its-platform \
  -f ./iac/helm/its-platform/values-staging.yaml \
  -n its-platform-staging --create-namespace

# Production
helm install its-platform ./iac/helm/its-platform \
  -f ./iac/helm/its-platform/values-prod.yaml \
  -n its-platform-prod --create-namespace
```

### Using ArgoCD (Recommended)

Apply the ArgoCD Application manifests:

```bash
# Development (auto-sync enabled)
kubectl apply -f ./iac/argocd/applications/its-platform-dev.yaml

# Staging (auto-sync enabled)
kubectl apply -f ./iac/argocd/applications/its-platform-staging.yaml

# Production (manual sync required)
kubectl apply -f ./iac/argocd/applications/its-platform-prod.yaml
```

Also apply the AppProject:

```bash
kubectl apply -f ./iac/argocd/projects/its-platform.yaml
```

## Configuration

### Key Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `global.environment` | Environment name (dev/staging/prod) | `dev` |
| `global.imageRegistry` | Container image registry | `ghcr.io` |
| `deployment.replicas` | Number of replicas (when HPA disabled) | `1` |
| `deployment.resources` | CPU/Memory requests and limits | See values.yaml |
| `ingress.enabled` | Enable Ingress | `true` |
| `ingress.className` | Ingress class name | `nginx` |
| `ingress.hosts` | Ingress host rules | See values.yaml |
| `hpa.enabled` | Enable Horizontal Pod Autoscaler | `true` |
| `hpa.minReplicas` | Minimum replicas for HPA | `2` |
| `hpa.maxReplicas` | Maximum replicas for HPA | `10` |
| `networkPolicy.enabled` | Enable NetworkPolicy | `true` |
| `serviceMonitor.enabled` | Enable ServiceMonitor for Prometheus | `true` |
| `postgresql.enabled` | Deploy PostgreSQL via Helm | `true` |
| `backup.enabled` | Enable pgBackRest backups | `true` |
| `monitoring.prometheus.enabled` | Deploy Prometheus stack | `true` |

### Environment-Specific Overrides

#### Development (`values-dev.yaml`)
- 1 replica, no HPA
- Reduced resource limits
- Debug logging
- No backups
- Auto-sync via ArgoCD

#### Staging (`values-staging.yaml`)
- 2 replicas, HPA enabled (2-5)
- Production-like resources
- Info logging
- Backups enabled
- Auto-sync via ArgoCD on `staging-*` tags

#### Production (`values-prod.yaml`)
- 3 replicas, HPA enabled (3-10)
- Full resource limits
- Warning-level logging
- Backups enabled with cross-region replication
- **Manual sync only** via ArgoCD on `v*` tags

## Secrets Management

Secrets are managed externally via **SealedSecrets** or **External Secrets Operator**. The chart creates a Secret with placeholder values that should be replaced by the secrets operator.

Required secrets:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_PUBLIC_KEY` - Public key for JWT verification
- `REDIS_URL` - Redis connection string
- `KONG_REDIS_USERNAME` / `KONG_REDIS_PASSWORD` - Kong Redis credentials
- `SENTRY_DSN` - Sentry DSN for error tracking
- `backup.s3.accessKey` / `backup.s3.secretKey` - S3 credentials for pgBackRest
- `backup.crossRegion.s3.accessKey` / `backup.crossRegion.s3.secretKey` - DR region S3 credentials

### Using SealedSecrets

```bash
# Create sealed secret
kubectl create secret generic its-platform-secret \
  --from-literal=DATABASE_URL="postgresql://..." \
  --from-literal=JWT_PUBLIC_KEY="..." \
  --dry-run=client -o yaml | kubeseal -o yaml > sealed-secret.yaml

kubectl apply -f sealed-secret.yaml
```

### Using External Secrets Operator

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: its-platform-secrets
  namespace: its-platform-prod
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: ClusterSecretStore
  target:
    name: its-platform-secret
    creationPolicy: Owner
  data:
    - secretKey: DATABASE_URL
      remoteRef:
        key: its-platform/prod/database-url
    - secretKey: JWT_PUBLIC_KEY
      remoteRef:
        key: its-platform/prod/jwt-public-key
    # ... other secrets
```

## Monitoring

The chart includes ServiceMonitor for Prometheus scraping and optionally deploys the full LGTM stack (Loki, Grafana, Tempo, Prometheus).

### Dashboards

Grafana dashboards are included as ConfigMaps with the `grafana_dashboard: "1"` label for auto-discovery.

### Alerts

PrometheusRule alerts are included for:
- Service health (P1)
- Error rates (P1)
- Latency (P2)
- Database connections (P2)
- Backup status (P1)
- SLO burn rates (P1)

## Backup

pgBackRest is configured for:
- Daily full backups (02:00 UTC)
- Differential backups every 6 hours
- Cross-region replication (optional)
- Weekly restore tests
- Retention: 30 full, 7 diff, 7 archive

## Upgrading

```bash
helm upgrade its-platform ./iac/helm/its-platform \
  -f ./iac/helm/its-platform/values-prod.yaml \
  -n its-platform-prod
```

## Uninstalling

```bash
helm uninstall its-platform -n its-platform-prod
```

Note: PVCs and secrets are not deleted by default. Manually clean up if needed.

## Troubleshooting

### Check deployment status
```bash
kubectl get pods -n its-platform-prod -l app.kubernetes.io/name=its-platform
```

### View logs
```bash
kubectl logs -n its-platform-prod -l app.kubernetes.io/name=its-platform -c its-platform
```

### Check HPA status
```bash
kubectl get hpa -n its-platform-prod
```

### Verify Ingress
```bash
kubectl get ingress -n its-platform-prod
```

### Check pgBackRest status
```bash
kubectl exec -n its-platform-prod -it its-platform-postgresql-0 -c pgbackrest -- pgbackrest --stanza=prod info
```

## License

Proprietary - ITS Platform Team