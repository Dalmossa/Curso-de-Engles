# ITS Platform — Infrastructure as Code Specification

**Version:** 0.1.0-draft · **Classification:** Internal
**Source:** `Curso-de-Ingles/ITS-ARCHITECTURE.md` §9
**Tools:** Terraform 1.8+, Helm 3.13+, ArgoCD, Kubernetes 1.28+

---

## 1. Repository Structure

```
its-platform/
├── iac/
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── eks/
│   │   │   ├── rds-postgresql/
│   │   │   ├── elasticache-redis/
│   │   │   ├── s3-audio/
│   │   │   ├── cloudfront/
│   │   │   ├── route53/
│   │   │   ├── kms/
│   │   │   ├── iam/
│   │   │   └── monitoring/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── providers.tf
│   ├── helm/
│   │   └── its-platform/
│   │       ├── Chart.yaml
│   │       ├── values.yaml
│   │       ├── values-dev.yaml
│   │       ├── values-staging.yaml
│   │       ├── values-prod.yaml
│   │       ├── templates/
│   │       │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── configmap.yaml
│   │   │   ├── secret.yaml
│   │   │   ├── hpa.yaml
│   │   │   ├── servicemonitor.yaml
│   │   │   ├── pdb.yaml
│   │       └── charts/
│   │           ├── postgresql-12.1.0.tgz
│   │           ├── redis-17.0.0.tgz
│   │           └── kong-2.20.0.tgz
│   └── argocd/
│       ├── applications/
│       │   ├── its-platform-dev.yaml
│       │   ├── its-platform-staging.yaml
│       │   └── its-platform-prod.yaml
│       └── projects/
│           └── its-platform.yaml
```

---

## 2. Terraform Modules

### 2.1 VPC Module (`iac/terraform/modules/vpc/`)

```hcl
# main.tf
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "its-platform-${var.environment}"

  cidr_block = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway     = true
  single_nat_gateway     = var.environment == "dev"
  enable_dns_hostnames   = true
  enable_dns_support     = true
  enable_classiclink     = false
  assign_generated_ipv6_cidr_block = false

  # Private subnets for: EKS nodes, RDS, ElastiCache
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/its-platform-${var.environment}" = "owned"
  }

  # Public subnets for: NAT Gateway, ALB (if needed)
  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
    "kubernetes.io/cluster/its-platform-${var.environment}" = "owned"
  }

  # VPC Flow Logs
  flow_log_destination_arn = aws_cloudwatch_log_group.vpc_flow_logs.arn
  flow_log_traffic_type    = "ALL"

  tags = local.common_tags
}

# VPC Flow Logs to CloudWatch
resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "/aws/vpc/its-platform-${var.environment}/flowlogs"
  retention_in_days = var.environment == "prod" ? 365 : 30
  kms_key_id        = aws_kms_key.flow_logs.arn
}
```

### 2.2 EKS Module (`iac/terraform/modules/eks/`)

```hcl
# main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "its-platform-${var.environment}"
  cluster_version = "1.28"

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  cluster_encryption_config = [{
    provider_key_arn = aws_kms_key.eks.arn
    resources        = ["secrets"]
  }]

  # Managed Node Groups
  eks_managed_node_groups = {
    general = {
      name           = "general"
      instance_types = var.environment == "prod" ? ["m6i.xlarge", "m6i.2xlarge"] : ["t3.medium"]
      capacity_type  = "ON_DEMAND"

      min_size     = var.environment == "prod" ? 3 : 1
      max_size     = var.environment == "prod" ? 20 : 5
      desired_size = var.environment == "prod" ? 5 : 2

      labels = {
        workload-type = "general"
        environment   = var.environment
      }

      taints = [{
        key    = "workload-type"
        value  = "general"
        effect = "PREFER_NO_SCHEDULE"
      }]

      tags = merge(local.common_tags, {
        "kubernetes.io/cluster/its-platform-${var.environment}" = "owned"
      })
    }

    adaptive = {
      name           = "adaptive"
      instance_types = ["r6i.xlarge", "r6i.2xlarge"]
      capacity_type  = "SPOT"

      min_size     = 0
      max_size     = var.environment == "prod" ? 10 : 3
      desired_size = 0

      labels = {
        workload-type = "adaptive"
        environment   = var.environment
      }

      taints = [{
        key    = "workload-type"
        value  = "adaptive"
        effect = "NO_SCHEDULE"
      }]
    }
  }

  # IRSA for service accounts
  iam_role_permissions_boundary = var.iam_permissions_boundary

  # Add-ons
  enable_irsa = true

  cluster_addons = {
    vpc-cni = {
      most_recent = true
    }
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
      service_account_role_arn = aws_iam_role.ebs_csi.arn
    }
  }

  tags = local.common_tags
}

# IAM for IRSA
resource "aws_iam_role" "ebs_csi" {
  name = "its-platform-${var.environment}-ebs-csi-driver"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/${module.eks.oidc_provider_url}"
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${module.eks.oidc_provider_url}:sub" = "system:serviceaccount:kube-system:ebs-csi-controller-sa"
        }
      }
    }]
  })
}
```

### 2.3 RDS PostgreSQL Module (`iac/terraform/modules/rds-postgresql/`)

```hcl
# main.tf
resource "aws_db_subnet_group" "its_platform" {
  name       = "its-platform-${var.environment}"
  subnet_ids = var.private_subnet_ids
  tags       = local.common_tags
}

resource "aws_security_group" "rds" {
  name        = "its-platform-${var.environment}-rds"
  vpc_id      = var.vpc_id
  description = "Security group for RDS PostgreSQL"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [var.eks_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_kms_key" "rds" {
  description             = "RDS encryption key for its-platform-${var.environment}"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "Allow administration"
      Effect = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action = "kms:*"
      Resource = "*"
    }, {
      Sid    = "Allow RDS use"
      Effect = "Allow"
      Principal = { Service = "rds.amazonaws.com" }
      Action = ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"]
      Resource = "*"
    }]
  })
}

resource "aws_db_instance" "primary" {
  identifier             = "its-platform-${var.environment}-primary"
  engine                 = "postgres"
  engine_version         = "16.3"
  instance_class         = var.environment == "prod" ? "db.r6g.xlarge" : "db.t4g.medium"
  allocated_storage      = var.environment == "prod" ? 500 : 100
  max_allocated_storage  = var.environment == "prod" ? 2000 : 500
  storage_encrypted      = true
  kms_key_id             = aws_kms_key.rds.arn
  storage_type           = "gp3"
  iops                   = var.environment == "prod" ? 10000 : null

  db_name  = "its_platform"
  username = "its_platform_admin"
  password = random_password.db_password.result
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.its_platform.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = var.environment == "prod" ? 30 : 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:06:00"

  skip_final_snapshot = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "its-platform-${var.environment}-final-${formatdate("YYYY-MM-DD", timestamp())}" : null

  deletion_protection = var.environment == "prod"

  performance_insights_enabled = true
  performance_insights_kms_key_id = aws_kms_key.rds.arn
  performance_insights_retention_period = 7

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  tags = local.common_tags
}

# Read Replicas
resource "aws_db_instance" "replica" {
  count = var.environment == "prod" ? 2 : 1

  identifier           = "its-platform-${var.environment}-replica-${count.index + 1}"
  replicate_source_db  = aws_db_instance.primary.identifier
  instance_class       = var.environment == "prod" ? "db.r6g.xlarge" : "db.t4g.medium"
  monitoring_interval  = 60
  monitoring_role_arn  = aws_iam_role.rds_monitoring.arn

  tags = local.common_tags
}

# Secrets Manager for password rotation
resource "aws_secretsmanager_secret" "db_password" {
  name        = "its-platform/${var.environment}/rds/password"
  description = "RDS PostgreSQL password for its-platform-${var.environment}"
  kms_key_id  = aws_kms_key.rds.arn
  tags        = local.common_tags
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({
    username = "its_platform_admin"
    password = random_password.db_password.result
    host     = aws_db_instance.primary.endpoint
    port     = 5432
    dbname   = "its_platform"
  })
}
```

### 2.4 S3 Audio Module (`iac/terraform/modules/s3-audio/`)

```hcl
# main.tf
resource "aws_s3_bucket" "audio" {
  bucket = "its-platform-${var.environment}-audio-${data.aws_caller_identity.current.account_id}"
  force_destroy = var.environment != "prod"
}

resource "aws_s3_bucket_versioning" "audio" {
  bucket = aws_s3_bucket.audio.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "audio" {
  bucket = aws_s3_bucket.audio.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "audio" {
  bucket = aws_s3_bucket.audio.id

  rule {
    id     = "expire-audio-recordings"
    status = "Enabled"

    filter {
      prefix = "audio/"
    }

    expiration {
      days = 30
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }

  rule {
    id     = "expire-temp-uploads"
    status = "Enabled"

    filter {
      prefix = "temp/"
    }

    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_public_access_block" "audio" {
  bucket = aws_s3_bucket.audio.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_kms_key" "s3" {
  description             = "S3 encryption key for its-platform-${var.environment}-audio"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "Allow administration"
      Effect = "Allow"
      Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
      Action = "kms:*"
      Resource = "*"
    }, {
      Sid    = "Allow S3 use"
      Effect = "Allow"
      Principal = { Service = "s3.amazonaws.com" }
      Action = ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"]
      Resource = "*"
      Condition = {
        StringEquals = {
          "kms:EncryptionContext:aws:s3:arn" = "arn:aws:s3:::its-platform-${var.environment}-audio-${data.aws_caller_identity.current.account_id}"
        }
      }
    }]
  })
}
```

---

## 3. Helm Chart (`iac/helm/its-platform/`)

### 3.1 Chart.yaml

```yaml
apiVersion: v2
name: its-platform
description: ITS Platform Helm Chart
type: application
version: 0.1.0
appVersion: "0.1.0"
keywords:
  - its
  - education
  - adaptive-learning
maintainers:
  - name: Platform Team
    email: platform@its.example.com
dependencies:
  - name: postgresql
    version: "12.1.0"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
  - name: redis
    version: "17.0.0"
    repository: "https://charts.bitnami.com/bitnami"
    condition: redis.enabled
  - name: kong
    version: "2.20.0"
    repository: "https://charts.konghq.com"
    condition: kong.enabled
```

### 3.2 values.yaml (Base)

```yaml
global:
  environment: "dev"
  imageRegistry: "ghcr.io/its-platform"
  imagePullSecrets:
    - name: regcred

  # Common labels
  labels:
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/instance: its-platform

# PostgreSQL (disable if using external RDS)
postgresql:
  enabled: false
  # external:
  #   host: "its-platform-dev-primary.xxx.us-east-1.rds.amazonaws.com"
  #   port: 5432
  #   database: "its_platform"
  #   existingSecret: its-platform-db-secret

# Redis (disable if using external ElastiCache)
redis:
  enabled: false
  # external:
  #   host: "its-platform-dev.xxx.use1.cache.amazonaws.com"
  #   port: 6379
  #   existingSecret: its-platform-redis-secret

# Kong API Gateway
kong:
  enabled: true
  env:
    KONG_DATABASE: "off"
    KONG_DECLARATIVE_CONFIG: /kong/declarative/kong.yml
    KONG_PROXY_ACCESS_LOG: /dev/stdout
    KONG_PROXY_ERROR_LOG: /dev/stderr
    KONG_ADMIN_ACCESS_LOG: /dev/stdout
    KONG_ADMIN_ERROR_LOG: /dev/stderr
  ingressController:
    enabled: false
  proxy:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
      service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
  envFrom:
    - secretRef:
        name: kong-secrets

# Application Services
services:
  curriculum:
    replicaCount: 3
    image: curriculum-service
    port: 8000
    resources:
      limits:
        cpu: 1000m
        memory: 1Gi
      requests:
        cpu: 250m
        memory: 512Mi
    autoscaling:
      enabled: true
      minReplicas: 3
      maxReplicas: 10
      targetCPUUtilizationPercentage: 70
    env:
      - name: DATABASE_URL
        valueFrom:
          secretKeyRef:
            name: its-platform-secrets
            key: database-url
      - name: REDIS_URL
        valueFrom:
          secretKeyRef:
            name: its-platform-secrets
            key: redis-url
      - name: JWT_PUBLIC_KEY
        valueFrom:
          secretKeyRef:
            name: its-platform-secrets
            key: jwt-public-key
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8000
      initialDelaySeconds: 10
      periodSeconds: 30
    readinessProbe:
      httpGet:
        path: /ready
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 10

  adaptive:
    replicaCount: 2
    image: adaptive-engine
    port: 8000
    resources:
      limits:
        cpu: 2000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 1Gi
    autoscaling:
      enabled: true
      minReplicas: 2
      maxReplicas: 8
      targetCPUUtilizationPercentage: 60
    nodeSelector:
      workload-type: adaptive
    tolerations:
      - key: "workload-type"
        operator: "Equal"
        value: "adaptive"
        effect: "NoSchedule"

  diagnostic:
    replicaCount: 2
    image: diagnostic-service
    port: 8000
    resources:
      limits:
        cpu: 1000m
        memory: 1Gi
      requests:
        cpu: 250m
        memory: 512Mi

  content:
    replicaCount: 3
    image: content-service
    port: 8000
    resources:
      limits:
        cpu: 500m
        memory: 512Mi
      requests:
        cpu: 100m
        memory: 256Mi

  assessment:
    replicaCount: 2
    image: assessment-service
    port: 8000
    resources:
      limits:
        cpu: 1000m
        memory: 1Gi
      requests:
        cpu: 250m
        memory: 512Mi

  listening:
    replicaCount: 2
    image: listening-service
    port: 8000
    resources:
      limits:
        cpu: 1000m
        memory: 1Gi
      requests:
        cpu: 250m
        memory: 512Mi

  auth:
    replicaCount: 3
    image: auth-service
    port: 8000
    resources:
      limits:
        cpu: 500m
        memory: 512Mi
      requests:
        cpu: 100m
        memory: 256Mi

# Celery Workers
celery:
  worker:
    replicaCount: 3
    image: celery-worker
    resources:
      limits:
        cpu: 1000m
        memory: 1Gi
      requests:
        cpu: 250m
        memory: 512Mi
    autoscaling:
      enabled: true
      minReplicas: 3
      maxReplicas: 20
      targetCPUUtilizationPercentage: 70
    env:
      - name: CELERY_BROKER_URL
        valueFrom:
          secretKeyRef:
            name: its-platform-secrets
            key: redis-url
      - name: CELERY_RESULT_BACKEND
        valueFrom:
          secretKeyRef:
            name: its-platform-secrets
            key: redis-url
      - name: DATABASE_URL
        valueFrom:
          secretKeyRef:
            name: its-platform-secrets
            key: database-url
    nodeSelector:
      workload-type: adaptive
    tolerations:
      - key: "workload-type"
        operator: "Equal"
        value: "adaptive"
        effect: "NoSchedule"

# Monitoring
monitoring:
  prometheus:
    enabled: true
    serviceMonitor:
      enabled: true
      interval: 30s
  grafana:
    enabled: true
    dashboards:
      its-platform-overview:
        json: |
          { ... dashboard JSON ... }

# Network Policies
networkPolicies:
  enabled: true
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: its-platform
      ports:
        - protocol: TCP
          port: 8000
```

### 3.3 Environment Overrides (`values-prod.yaml`)

```yaml
global:
  environment: "prod"

services:
  curriculum:
    replicaCount: 5
    resources:
      limits:
        cpu: 2000m
        memory: 2Gi
    autoscaling:
      maxReplicas: 20

  adaptive:
    replicaCount: 5
    resources:
      limits:
        cpu: 4000m
        memory: 4Gi

celery:
  worker:
    replicaCount: 10
    autoscaling:
      maxReplicas: 50

kong:
  proxy:
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
      service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
      service.beta.kubernetes.io/aws-load-balancer-attributes: "load_balancing.cross_zone.enabled=true"
```

---

## 4. ArgoCD Applications

```yaml
# iac/argocd/applications/its-platform-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: its-platform-prod
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: its-platform
  source:
    repoURL: https://github.com/its-platform/its-platform.git
    targetRevision: main
    path: iac/helm/its-platform
    helm:
      valueFiles:
        - values.yaml
        - values-prod.yaml
      parameters:
        - name: global.environment
          value: "prod"
  destination:
    server: https://kubernetes.default.svc
    namespace: its-platform-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

---

## 5. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/iac.yml
name: Infrastructure CI/CD

on:
  push:
    paths:
      - 'iac/**'
    branches: [main]
  pull_request:
    paths:
      - 'iac/**'

jobs:
  terraform:
    name: Terraform Plan/Apply
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: iac/terraform/environments/${{ matrix.env }}
    strategy:
      matrix:
        env: [dev, staging, prod]
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.8.0
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Terraform Init
        run: terraform init -backend-config=backend.hcl
      - name: Terraform Format
        run: terraform fmt -check -recursive
      - name: Terraform Validate
        run: terraform validate
      - name: Terraform Plan
        id: plan
        run: terraform plan -out=tfplan -input=false
      - name: Terraform Apply (dev/staging only)
        if: matrix.env != 'prod' && github.event_name == 'push'
        run: terraform apply -input=false tfplan
      - name: Terraform Plan Summary
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const output = `${{ steps.plan.outputs.stdout }}`
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `### Terraform Plan (${{ matrix.env }})\n\`\`\`\n${output}\n\`\`\``
            })

  helm:
    name: Helm Lint/Template Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/setup-helm@v4
      - name: Helm Lint
        run: helm lint iac/helm/its-platform
      - name: Helm Template (all envs)
        run: |
          for env in dev staging prod; do
            helm template its-platform iac/helm/its-platform \
              -f iac/helm/its-platform/values.yaml \
              -f iac/helm/its-platform/values-${env}.yaml \
              --namespace its-platform-${env} > /dev/null
          done

  argocd:
    name: ArgoCD Sync (dev/staging)
    needs: [terraform, helm]
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Sync to ArgoCD (dev)
        run: |
          argocd app sync its-platform-dev --prune
        env:
          ARGOCD_SERVER: ${{ secrets.ARGOCD_SERVER }}
          ARGOCD_AUTH_TOKEN: ${{ secrets.ARGOCD_TOKEN }}
      - name: Sync to ArgoCD (staging)
        run: |
          argocd app sync its-platform-staging --prune
        env:
          ARGOCD_SERVER: ${{ secrets.ARGOCD_SERVER }}
          ARGOCD_AUTH_TOKEN: ${{ secrets.ARGOCD_TOKEN }}
```

---

## 6. GitOps Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Developer  │────▶│  GitHub PR  │────▶│  CI Pipeline│────▶│  ArgoCD     │
│  Changes    │     │  (Review)   │     │  (Validate) │     │  (Sync)     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                       │
                                                                       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Monitor    │◀────│  Deployed   │◀────│  K8s Apply  │◀────│  Manifests  │
│  & Alert    │     │  to Cluster │     │  (Helm)     │     │  Generated  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**Branch Strategy:**
- `main` → auto-deploy to `dev` → auto-promote to `staging` after tests
- `release/v*` → manual promote to `prod` via ArgoCD UI

---

## 7. Disaster Recovery (Terraform)

```hcl
# DR region (us-west-2) - minimal resources, scaled on failover
module "vpc_dr" {
  source = "./modules/vpc"
  environment = "dr"
  vpc_cidr = "10.1.0.0/16"
  # ... smaller subnets
}

module "eks_dr" {
  source = "./modules/eks"
  environment = "dr"
  # Only 1 node group, min_size = 0
}

# RDS cross-region replica (managed by AWS)
resource "aws_db_instance" "dr_replica" {
  identifier           = "its-platform-dr-replica"
  replicate_source_db  = "arn:aws:rds:us-east-1:xxx:db:its-platform-prod-primary"
  instance_class       = "db.r6g.xlarge"
  publicly_accessible  = false
}
```

---

## 8. Security & Compliance (IaC)

| Control | Implementation |
|---|---|
| **No hardcoded secrets** | All via AWS Secrets Manager / Vault; `tfsec` in CI |
| **Least privilege IAM** | Module-level roles, condition keys |
| **Encryption everywhere** | KMS for EBS, RDS, S3, EKS secrets, ElastiCache |
| **Network segmentation** | Private subnets only; NAT for egress; SG per tier |
| **Immutable infrastructure** | No SSH access; all changes via IaC |
| **Drift detection** | `terraform plan` daily via GitHub Actions |
| **Policy as Code** | `opa` policies for Terraform (no public SG, no unencrypted) |

---

## 9. Cost Optimization

| Resource | Strategy |
|---|---|
| EKS nodes | Spot for adaptive workers; Savings Plans for general |
| RDS | Reserved Instances (1yr) for prod primary; gp3 storage |
| ElastiCache | Reserved nodes for prod; auto-scaling for dev |
| S3 | Intelligent Tiering for audio; lifecycle to Glacier |
| CloudFront | Price class 100 (US/EU only) |
| Data transfer | VPC endpoints for S3/DynamoDB; CloudFront caching |

---

## 10. Validation Checklist

| Stage | Check |
|---|---|
| **PR** | `terraform fmt`, `terraform validate`, `tfsec`, `opa policy`, `helm lint` |
| **Merge to main** | Auto-deploy to `dev`, run integration tests |
| **Promote to staging** | Manual approval, run contract tests |
| **Promote to prod** | Manual approval, run smoke tests, 10% canary |
| **Post-deploy** | Verify health checks, dashboards, alerts |