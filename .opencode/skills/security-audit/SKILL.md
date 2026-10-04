---
name: Security Audit
description: OWASP ASVS, threat modeling, LGPD/GDPR compliance, vulnerability scanning, secure code review for ITS Platform
---

# Security Audit Skill — ITS Platform

## When to Use
- Performing security code reviews
- Running vulnerability scans (SAST, DAST, SCA, container)
- Validating LGPD/GDPR compliance
- Checking OWASP ASVS Level 2 compliance
- Threat model updates and STRIDE analysis

## Workflow

### 1. SAST (Static Application Security Testing)
```bash
# Every PR - bandit + semgrep
bandit -r its_platform/ -f json -o bandit-report.json
semgrep --config=auto its_platform/ --json=semgrep-report.json

# CI integration
# .github/workflows/security.yml
# - uses: returntocorp/semgrep-action@v1
# - uses: bandit-action@v1
```

### 2. Dependency Scanning (SCA)
```bash
# Daily + PR
pip-audit -r requirements.txt --format=json
pip-audit -r requirements-dev.txt --format=json

# Dependabot alerts (auto-enabled in GitHub)
# .github/dependabot.yml
# version: 2
# updates:
#   - package-ecosystem: "pip"
#     directory: "/"
#     schedule: {interval: "daily"}
```

### 3. Container Scanning
```bash
# Every build
trivy image its-platform/api:latest --format json -o trivy-report.json
trivy image its-platform/celery-worker:latest --format json -o trivy-report.json

# CI: fail on HIGH/CRITICAL
trivy image --severity HIGH,CRITICAL --exit-code 1 its-platform/api:latest
```

### 4. DAST (Dynamic Application Security Testing)
```bash
# Weekly - OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://staging-api.its.example.com \
  -r zap-report.html

# Full scan with authentication
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://staging-api.its.example.com \
  -z "-config authentication=oauth2"
```

### 5. OWASP ASVS 4.0 Level 2 Checklist
```markdown
# ASVS 4.0 L2 Verification (run per release)

## V1: Architecture
- [ ] 1.1.1 Verify secure SDLC
- [ ] 1.2.1 Verify threat model (STRIDE)
- [ ] 1.3.1 Verify security requirements

## V2: Authentication
- [ ] 2.1.1 Verify password policy (Argon2id)
- [ ] 2.2.1 Verify MFA/JWT (RS256, PKCE)
- [ ] 2.3.1 Verify session management (15m/30d)

## V3: Session Management
- [ ] 3.1.1 Verify session timeout (15m access)
- [ ] 3.2.1 Verify secure cookies (httpOnly, Secure, SameSite)
- [ ] 3.3.1 Verify token rotation (quarterly)

## V4: Access Control
- [ ] 4.1.1 Verify RBAC (learner/teacher/author/admin)
- [ ] 4.2.1 Verify ABAC (OPA policies)
- [ ] 4.3.1 Verify RLS (all learner-scoped tables)

## V5: Validation
- [ ] 5.1.1 Verify input validation (Pydantic strict)
- [ ] 5.2.1 Verify output encoding (JSON, CSP)
- [ ] 5.3.1 Verify SQL injection prevention (SQLAlchemy ORM)

## V7: Error Handling
- [ ] 7.1.1 Verify no stack traces in prod
- [ ] 7.2.1 Verify generic error messages

## V8: Data Protection
- [ ] 8.1.1 Verify encryption at rest (AES-256-GCM)
- [ ] 8.2.1 Verify encryption in transit (TLS 1.3)
- [ ] 8.3.1 Verify key management (KMS rotation)

## V9: Communications
- [ ] 9.1.1 Verify TLS 1.3 only
- [ ] 9.2.1 Verify certificate validation

## V10: Malicious Code
- [ ] 10.1.1 Verify no hardcoded secrets
- [ ] 10.2.1 Verify dependency scanning
- [ ] 10.3.1 Verify container scanning
```

### 5. LGPD/GDPR Compliance Check
```python
# its_platform/security/compliance_check.py
from dataclasses import dataclass
from typing import List

@dataclass
class ComplianceCheck:
    article: str
    requirement: str
    implemented: bool
    evidence: str

LGPD_CHECKS = [
    ComplianceCheck(
        article="Art. 7",
        requirement="Lawful basis documented for all processing",
        implemented=True,
        evidence="security-spec.md §3.2 - lawful basis mapping"
    ),
    ComplianceCheck(
        article="Art. 18",
        requirement="Data subject rights: access, rectification, erasure, portability",
        implemented=True,
        evidence="GET /learners/me/data-export, DELETE /learners/me"
    ),
    ComplianceCheck(
        article="Art. 46",
        requirement="International transfer safeguards (SCCs)",
        implemented=True,
        evidence="AWS SA regions, SCCs in vendor contracts"
    ),
    ComplianceCheck(
        article="Art. 48",
        requirement="DPO appointed",
        implemented=True,
        evidence="DPO assigned, contact in security-spec.md"
    ),
]
```

## Validation Checklist
- [ ] SAST (bandit + semgrep) passes in CI
- [ ] Dependency scan (pip-audit) passes in CI
- [ ] Container scan (trivy) passes in CI
- [ ] DAST (ZAP) scheduled weekly
- [ ] OWASP ASVS 4.0 L2 checklist ≥ 90% complete
- [ ] LGPD/GDPR compliance checks all pass
- [ ] Threat model updated (quarterly)
- [ ] Pen test annual + red team annual scheduled
- [ ] Secrets scan (git-secrets) in pre-commit hook