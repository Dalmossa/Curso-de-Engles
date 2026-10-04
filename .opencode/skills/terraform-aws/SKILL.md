---
name: Terraform AWS
description: Terraform modules for AWS (VPC, EKS, RDS, ElastiCache, S3, KMS, IAM)
---

# Terraform AWS Skill — ITS Platform

## When to Use
- Provisioning AWS infrastructure
- Creating reusable Terraform modules
- Managing multi-environment deployments
- Implementing security best practices

## Module Structure

```
iac/terraform/
├── modules/
│   ├── vpc/
│   ├── eks/
│   ├── rds-postgresql/
│   ├── elasticache-redis/
│   ├── s3-audio/
│   ├── cloudfront/
│   ├── route53/
│   ├── kms/
│   ├── iam/
│   └── monitoring/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── providers.tf
```

## Key Modules

### VPC Module
```hcl
# modules/vpc/main.tf
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

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/its-platform-${var.environment}" = "owned"
  }

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
    "kubernetes.io/cluster/its-platform-${var.environment}" = "owned"
  }

  # VPC Flow Logs
  flow_log_destination_arn = aws_cloudwatch_log_group.vpc_flow_logs.arn
  flow_log_traffic_type    = "ALL"

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "/aws/vpc/its-platform-${var.environment}/flowlogs"
  retention_in_days = var.environment == "prod" ? 365 : 30
  kms_key_id        = aws_kms_key.flow_logs.arn
}
```

### EKS Module
```hcl
# modules/eks/main.tf
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

  enable_irsa = true

  cluster_addons = {
    vpc-cni        = { most_recent = true }
    coredns        = { most_recent = true }
    kube-proxy     = { most_recent = true }
    aws-ebs-csi-driver = {
      most_recent = true
      service_account_role_arn = aws_iam_role.ebs_csi.arn
    }
  }

  tags = local.common_tags
}
```

### RDS PostgreSQL Module
```hcl
# modules/rds-postgresql/main.tf
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
  deletion_protection   = var.environment == "prod"

  performance_insights_enabled = true
  performance_insights_kms_key_id = aws_kms_key.rds.arn

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
```

### S3 Audio Module
```hcl
# modules/s3-audio/main.tf
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
}

resource "aws_s3_bucket_public_access_block" "audio" {
  bucket = aws_s3_bucket.audio.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

## Environment Configuration

```hcl
# environments/prod/main.tf
module "vpc" {
  source = "../../modules/vpc"
  environment = "prod"
  vpc_cidr = "10.0.0.0/16"
  # ...
}

module "eks" {
  source = "../../modules/eks"
  environment = "prod"
  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  # ...
}
```

## CI/CD Pipeline

```yaml
# .github/workflows/iac.yml
jobs:
  terraform:
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
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
      - name: Terraform Init
        run: terraform init -backend-config=backend.hcl
      - name: Terraform Validate
        run: terraform validate
      - name: Terraform Plan
        id: plan
        run: terraform plan -out=tfplan -input=false
      - name: Terraform Apply (dev/staging)
        if: matrix.env != 'prod' && github.event_name == 'push'
        run: terraform apply -input=false tfplan
```

## Validation Checklist
- [ ] Modules are reusable and parameterized
- [ ] No hardcoded secrets (use AWS Secrets Manager)
- [ ] Least privilege IAM roles
- [ ] Encryption everywhere (KMS for EBS, RDS, S3, EKS)
- [ ] Network segmentation (private subnets only)
- [ ] Drift detection (daily `terraform plan`)
- [ ] Policy as Code (OPA for Terraform)
- [ ] Cost optimization (Spot, Savings Plans, gp3, Intelligent Tiering)