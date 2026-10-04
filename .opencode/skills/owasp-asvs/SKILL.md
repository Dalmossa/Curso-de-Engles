---
name: OWASP ASVS
description: OWASP ASVS 4.0 Level 2 compliance verification for ITS Platform
---

# OWASP ASVS 4.0 Level 2 Skill — ITS Platform

## When to Use
- Verifying security requirements compliance
- Conducting security assessments
- Preparing for penetration testing
- Security code reviews

## ASVS 4.0 Level 2 Checklist

### V1: Architecture, Design & Threat Modeling
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 1.1.1 | Secure SDLC implemented | Documented SDLC with security gates | ✅ |
| 1.1.2 | Threat model created | STRIDE + ATT&CK documented | ✅ |
| 1.1.3 | Security requirements defined | In PRD/Specs | ✅ |
| 1.2.1 | Components identified | Architecture docs | ✅ |
| 1.2.2 | Trust boundaries defined | System boundary diagram | ✅ |
| 1.2.3 | Data flows documented | Data flow diagrams | ✅ |
| 1.3.1 | Security requirements traceable | Linked to ADRs | ✅ |
| 1.4.1 | Business logic security | Domain-driven design | ✅ |
| 1.5.1 | Security architecture reviewed | ADR process | ✅ |

### V2: Authentication
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 2.1.1 | Password policy (Argon2id) | Argon2id t=3,m=64MB,p=4 | ✅ |
| 2.1.2 | Breached password check | HaveIBeenPwned API | ✅ |
| 2.1.3 | Password reset secure | Time-limited tokens | ✅ |
| 2.2.1 | MFA/JWT | RS256, PKCE, 15m/30d | ✅ |
| 2.2.2 | Auth bypass prevented | No default creds | ✅ |
| 2.3.1 | Session management | 15m access, 30d refresh | ✅ |
| 2.4.1 | Secure cookies | httpOnly, Secure, SameSite=Strict | ✅ |
| 2.5.1 | Token rotation | Quarterly RS256 key rotation | ✅ |
| 2.6.1 | Device binding | Device fingerprinting | ✅ |

### V3: Session Management
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 3.1.1 | Session timeout | 15min access token | ✅ |
| 3.1.2 | Idle timeout | Configurable | ✅ |
| 3.2.1 | Secure cookies | httpOnly, Secure, SameSite | ✅ |
| 3.2.2 | Cookie prefix | __Host- prefix | ✅ |
| 3.3.1 | Token rotation | Quarterly | ✅ |
| 3.4.1 | Concurrent sessions | Limited per user | ✅ |
| 3.5.1 | Logout invalidates | Server-side revocation | ✅ |

### V4: Access Control
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 4.1.1 | RBAC enforced | learner/teacher/author/admin | ✅ |
| 4.1.2 | ABAC/OPA | reuse_basis, content license | ✅ |
| 4.1.3 | RLS enforced | All learner-scoped tables | ✅ |
| 4.2.1 | Deny by default | Explicit allow policies | ✅ |
| 4.2.2 | Resource-level auth | Per-resource policies | ✅ |
| 4.3.1 | API auth required | All endpoints protected | ✅ |
| 4.4.1 | Direct object refs | UUIDs, not sequential IDs | ✅ |
| 4.5.1 | Mass assignment protected | Pydantic strict models | ✅ |
| 4.6.1 | CORS policy | Restrictive origins | ✅ |

### V5: Validation, Sanitization & Encoding
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 5.1.1 | Input validation | Pydantic strict=True | ✅ |
| 5.1.2 | Allow-list validation | Enums, regex patterns | ✅ |
| 5.2.1 | Output encoding | JSON, CSP headers | ✅ |
| 5.2.2 | HTML sanitization | Not applicable (API only) | N/A |
| 5.3.1 | SQL injection prevention | SQLAlchemy ORM only | ✅ |
| 5.3.2 | NoSQL injection | Not applicable | N/A |
| 5.4.1 | XXE prevention | defusedxml | ✅ |
| 5.5.1 | File upload validation | MIME, size, scanning | ✅ |

### V6: Stored Cryptography
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 6.1.1 | Encryption at rest | AES-256-GCM | ✅ |
| 6.1.2 | Field-level encryption | θ estimates, audio refs | ✅ |
| 6.2.1 | Key management | AWS KMS / Vault | ✅ |
| 6.2.2 | Key rotation | 90 days auto, quarterly manual | ✅ |
| 6.3.1 | Password hashing | Argon2id (t=3,m=64MB,p=4) | ✅ |
| 6.3.2 | PBKDF2 for refresh | 100k iterations | ✅ |
| 6.4.1 | TLS 1.3 only | TLS 1.3 enforced | ✅ |
| 6.5.1 | Certificate validation | Full chain validation | ✅ |

### V7: Error Handling & Logging
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 7.1.1 | No stack traces | Generic error responses | ✅ |
| 7.2.1 | Generic messages | RFC 7807 Problem Details | ✅ |
| 7.3.1 | Security logging | Structured JSON audit log | ✅ |
| 7.4.1 | Log integrity | Hash-chained audit log | ✅ |
| 7.5.1 | No sensitive data | PII scrubbing in logs | ✅ |

### V8: Data Protection
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 8.1.1 | Encryption at rest | AES-256-GCM | ✅ |
| 8.1.2 | Field-level encryption | θ, audio refs | ✅ |
| 8.2.1 | Encryption in transit | TLS 1.3 | ✅ |
| 8.3.1 | Key management | KMS rotation | ✅ |
| 8.4.1 | Data retention | Auto-delete policies | ✅ |
| 8.5.1 | Secure disposal | Crypto-shredding | ✅ |
| 8.6.1 | Backup encryption | pgBackRest + KMS | ✅ |

### V9: Communications Security
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 9.1.1 | TLS 1.3 only | Enforced at Kong/ALB | ✅ |
| 9.1.2 | Strong ciphers | ECDHE + AES-256-GCM | ✅ |
| 9.2.1 | Certificate validation | Full chain | ✅ |
| 9.3.1 | HSTS | Enabled | ✅ |
| 9.4.1 | Certificate pinning | Not required (API) | N/A |

### V10: Malicious Code
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 10.1.1 | No hardcoded secrets | git-secrets pre-commit | ✅ |
| 10.2.1 | Dependency scanning | dependabot, pip-audit | ✅ |
| 10.3.1 | Container scanning | trivy | ✅ |
| 10.4.1 | SAST | bandit, semgrep | ✅ |
| 10.5.1 | DAST | OWASP ZAP weekly | ✅ |

### V11: Business Logic
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 11.1.1 | Business logic tests | BDD scenarios | ✅ |
| 11.2.1 | Race condition prevention | DB constraints, optimistic locking | ✅ |
| 11.3.1 | Limits enforcement | Rate limiting, quotas | ✅ |
| 11.4.1 | Workflow bypass prevented | State machine validation | ✅ |

### V12: Files & Resources
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 12.1.1 | File upload validation | MIME, size, type | ✅ |
| 12.2.1 | Path traversal prevention | Secure paths | ✅ |
| 12.3.1 | Unrestricted upload | Blocked | ✅ |

### V13: API & Web Services
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 13.1.1 | API authentication | JWT RS256 | ✅ |
| 13.2.1 | Rate limiting | Per-learner, per-IP | ✅ |
| 13.3.1 | Input validation | Pydantic strict | ✅ |
| 13.4.1 | Output encoding | JSON, no HTML | ✅ |
| 13.5.1 | Versioning | /v1/, /v2/ | ✅ |

### V14: Configuration
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 14.1.1 | Secure defaults | Helmet, secure headers | ✅ |
| 14.2.1 | No debug in prod | DEBUG=false | ✅ |
| 14.3.1 | Secrets management | Vault/Secrets Manager | ✅ |
| 14.4.1 | Least privilege | RLS, RBAC, ABAC | ✅ |

### V15: Malware
| ID | Requirement | Verification | Status |
|----|-------------|--------------|--------|
| 15.1.1 | Malware scanning | ClamAV on audio upload | ✅ |
| 15.2.1 | Content analysis | MIME verification | ✅ |

## Automated Verification Script

```bash
#!/bin/bash
# asvs-check.sh - Run ASVS verification checks

echo "=== OWASP ASVS 4.0 Level 2 Verification ==="

# 1. SAST
echo "Running SAST..."
bandit -r its_platform/ -f json -o bandit-report.json --severity-level high
semgrep --config=auto its_platform/ --json=semgrep-report.json

# 2. Dependency scan
echo "Scanning dependencies..."
pip-audit -r requirements.txt --format=json -o pip-audit-report.json
pip-audit -r requirements-dev.txt --format=json -o pip-audit-dev-report.json

# 3. Container scan
echo "Scanning containers..."
trivy image --severity HIGH,CRITICAL --exit-code 1 its-platform/api:latest

# 3. Secret scan
echo "Scanning for secrets..."
git-secrets --scan

# 4. OpenAPI validation
echo "Validating OpenAPI spec..."
python -c "
from openapi_spec_validator import validate_spec
import json
with open('its-platform/docs/api-spec.openapi.yaml') as f:
    import yaml
    spec = yaml.safe_load(f)
validate_spec(spec)
print('OpenAPI spec valid')
"

# 5. RLS verification
echo "Verifying RLS policies..."
python -c "
import asyncio
from its_platform.db.session import get_db
from its_platform.db.models import Mastery
from uuid import uuid4

async def test_rls():
    async with get_db() as db:
        # Test RLS isolation
        pass
asyncio.run(test_rls())
"

# 6. TLS check
echo "Checking TLS configuration..."
python -c "
import ssl
import socket
ctx = ssl.create_default_context()
ctx.minimum_version = ssl.TLSVersion.TLSv1_3
ctx.maximum_version = ssl.TLSVersion.TLSv1_3
# Test connection
"

echo "=== ASVS Verification Complete ==="
```

## CI Integration

```yaml
# .github/workflows/asvs.yml
name: ASVS Compliance Check
on:
  schedule:
    - cron: '0 3 * * 0'  # Weekly Sunday 3am
  workflow_dispatch:
  pull_request:
    branches: [release/*]

jobs:
  asvs-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { submodules: recursive }
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -e ".[test]" bandit semgrep trivy pip-audit git-secrets
      - name: Run ASVS checks
        run: |
          chmod +x scripts/asvs-check.sh
          ./scripts/asvs-check.sh
      - name: Upload reports
        uses: actions/upload-artifact@v4
        with:
          name: asvs-reports
          path: |
            bandit-report.json
            semgrep-report.json
            pip-audit-report.json
            trivy-report.json
```

## Verification Checklist
- [ ] All V1-V15 categories reviewed
- [ ] Automated checks pass in CI
- [ ] Manual verification for business logic (V11)
- [ ] Penetration test scheduled (annual)
- [ ] Red team exercise scheduled (annual)
- [ ] ASVS score ≥ 90% for Level 2
- [ ] Remediation plan for any gaps
- [ ] Evidence collected for audit