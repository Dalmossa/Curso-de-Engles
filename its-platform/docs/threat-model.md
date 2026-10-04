# ITS Platform — Threat Model (STRIDE + ATT&CK Mapping)

**Version:** 0.1.0-draft · **Classification:** Internal
**Methodology:** Microsoft STRIDE + MITRE ATT&CK® for Cloud
**Source:** `Curso-de-Ingles/ITS-ARCHITECTURE.md` §8, `security-spec.md`

---

## 1. System Boundary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ITS PLATFORM TRUST BOUNDARY                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Learner    │  │   Teacher    │  │   Author     │  │   Admin      │   │
│  │   (SPA)      │  │   (SPA)      │  │   (SPA)      │  │   (SPA)      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │                 │           │
│         ▼                 ▼                 ▼                 ▼           │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    EDGE: Cloudflare WAF + DDoS                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│         ┌───────────────────────────┼───────────────────────────┐          │
│         ▼                           ▼                           ▼          │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐  │
│  │  API Gateway│             │  API Gateway│             │  API Gateway│  │
│  │  (Kong)     │             │  (Kong)     │             │  (Kong)     │  │
│  └──────┬──────┘             └──────┬──────┘             └──────┬──────┘  │
│         │                           │                           │          │
│         ▼                           ▼                           ▼          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    SERVICE MESH: Istio mTLS                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│         │                           │                           │          │
│  ┌──────┴──────┐             ┌──────┴──────┐             ┌──────┴──────┐  │
│  │  Curriculum │             │  Adaptive   │             │  Content    │  │
│  │  Service    │             │  Engine     │             │  Service    │  │
│  │  (FastAPI)  │             │  (FastAPI)  │             │  (FastAPI)  │  │
│  └──────┬──────┘             └──────┬──────┘             └──────┬──────┘  │
│         │                           │                           │          │
│         └───────────────────────────┼───────────────────────────┘          │
│                                     │                                       │
│  ┌──────────────────────────────────┼──────────────────────────────────┐   │
│  │  DATA LAYER (Private Subnet)     │                                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌─────┴─────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │PostgreSQL│ │  Redis   │ │    S3     │ │  Celery  │ │  Kafka   │  │   │
│  │  │  (RLS)   │ │ (Cluster)│ │  (Audio)  │ │ (Workers)│ │ (Events) │  │   │
│  │  └──────────┘ └──────────┘ └───────────┘ └──────────┘ └──────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Asset Inventory

| Asset | Type | Classification | Owner |
|---|---|---|---|
| Learner PII (email, UUID) | Data | Confidential | Platform Team |
| Mastery/θ/FSRS states | Data | Confidential | Adaptive Team |
| Audio recordings | Data | **Restricted (Biometric)** | Listening Team |
| Practice responses | Data | Confidential | Assessment Team |
| Content (lessons, packs) | Data | Internal | Content Team |
| JWT signing keys | Key | **Restricted** | Security Team |
| KMS master keys | Key | **Restricted** | Security Team |
| DB encryption keys | Key | **Restricted** | Platform Team |
| Source code | Code | Internal | All Teams |
| CI/CD secrets | Secret | **Restricted** | Platform Team |

---

## 3. STRIDE Analysis

### 3.1 Spoofing

| # | Threat | Asset | Attack Vector | Likelihood | Impact | Mitigation | Residual |
|---|---|---|---|---|---|---|---|
| S-01 | JWT token theft via XSS | Access tokens | Malicious script in SPA | Medium | High | CSP, httpOnly cookies for refresh, short TTL (15m) | Low |
| S-02 | Refresh token theft via CSRF | Refresh tokens | Cross-site request | Low | High | SameSite=Strict, double-submit cookie | Low |
| S-03 | Credential stuffing | Learner passwords | Automated login attempts | High | Medium | Rate limiting (5/min), CAPTCHA after 3 failures, breach detection | Low |
| S-04 | Session fixation | Session IDs | Predictable session IDs | Low | High | Random UUIDv4, rotate on privilege change | Low |
| S-05 | API key leakage | Service-to-service auth | GitHub, logs, env vars | Medium | High | Vault-managed, rotation, no keys in code | Low |
| S-06 | Device impersonation | Device tokens | Stolen device, backup restore | Low | Medium | Device binding, re-auth on new device | Low |

### 3.2 Tampering

| # | Threat | Asset | Attack Vector | Likelihood | Impact | Mitigation | Residual |
|---|---|---|---|---|---|---|---|
| T-01 | Mastery/θ manipulation | BKT/IRT state | Direct DB write, API tampering | Low | High | RLS, server-side only updates via worker, audit log | Low |
| T-02 | Practice response alteration | Item responses | MITM, client-side modification | Medium | Medium | TLS 1.3, request signing, server-side validation | Low |
| T-03 | Audio file substitution | Audio recordings | S3 presigned URL manipulation | Low | High | Signed URLs (5min TTL), KMS encryption, integrity hash | Low |
| T-04 | Curriculum graph corruption | Prerequisites, Status | Direct DB write | Low | High | RLS, immutable after publish, change control | Low |
| T-05 | Pack item/key modification | Assessment items | Direct DB write | Low | High | RLS, schema validation, checksum | Low |
| T-06 | Consent record tampering | Consent logs | Direct DB write | Low | Critical | Append-only table, cryptographic chaining, WORM | Low |

### 3.3 Repudiation

| # | Threat | Asset | Attack Vector | Likelihood | Impact | Mitigation | Residual |
|---|---|---|---|---|---|---|---|
| R-01 | Learner denies action | Audit trail | Claim account compromise | Medium | Medium | Immutable audit log, device binding, MFA | Low |
| R-02 | Teacher denies grade change | Audit trail | Manual DB edit | Low | Medium | Audit log on all writes, 4-eyes for manual changes | Low |
| R-03 | Author denies content change | Content audit | Git history rewrite | Low | Medium | Signed commits, protected branches, GPG | Low |
| R-04 | System denies data processing | Consent records | Log deletion | Low | Critical | WORM storage, hash chaining, external log shipper | Low |

### 3.4 Information Disclosure

| # | Threat | Asset | Attack Vector | Likelihood | Impact | Mitigation | Residual |
|---|---|---|---|---|---|---|---|
| I-01 | θ/mastery exposure via API | Theta estimates | Over-permissive RBAC, IDOR | Medium | High | ABAC, field-level encryption, least privilege | Low |
| I-02 | Audio recording leak | Audio files | S3 misconfig, presigned URL leak | Medium | Critical | Private bucket, 5min TTL URLs, KMS encryption | Low |
| I-03 | PII in logs | Email, UUID | Debug logging, error traces | Medium | High | Structured logging, PII scrubbing, log retention | Low |
| I-04 | Cross-learner data access | All learner data | IDOR, broken access control | Medium | High | RLS on learner_id, integration tests for ABAC | Low |
| I-05 | Source code / secrets leak | Source code, keys | GitHub public repo, supply chain | Low | Critical | Private repos, secret scanning, no secrets in code | Low |
| I-06 | Diagnostic results exposure | Diagnostic θ | API enumeration | Low | Medium | RBAC, rate limiting, audit | Low |

### 3.5 Denial of Service

| # | Threat | Asset | Attack Vector | Likelihood | Impact | Mitigation | Residual |
|---|---|---|---|---|---|---|---|
| D-01 | Adaptive engine overload | BKT/IRT workers | Mass practice submissions | Medium | High | Async queue (Celery), rate limiting, circuit breaker | Low |
| D-02 | Audio streaming saturation | S3/CDN bandwidth | Mass listening requests | Low | Medium | CDN caching, signed URLs, bandwidth limits | Low |
| D-03 | Database connection exhaustion | PostgreSQL | Connection pool exhaustion | Medium | High | PgBouncer, connection limits, query timeouts | Low |
| D-04 | Redis memory exhaustion | Session cache | Session fixation, cache stampede | Low | Medium | TTL enforcement, circuit breaker, fallback | Low |
| D-05 | Celery queue backlog | Task processing | Burst submissions | Medium | High | Priority queues, autoscaling workers, dead letter | Low |
| D-06 | API Gateway saturation | Kong | Request flood | High | Medium | Cloudflare rate limiting, WAF, auto-scale | Low |

### 3.6 Elevation of Privilege

| # | Threat | Asset | Attack Vector | Likelihood | Impact | Mitigation | Residual |
|---|---|---|---|---|---|---|---|
| E-01 | Learner → Teacher | Teacher permissions | JWT claim manipulation | Low | High | RS256 signing, claim validation, short TTL | Low |
| E-02 | Teacher → Admin | Admin permissions | Role assignment API abuse | Low | Critical | Admin-only endpoint, audit, 4-eyes | Low |
| E-03 | Container escape | Host/other containers | Kernel vuln, misconfig | Low | Critical | GVisor/Kata, read-only rootfs, no privileged | Low |
| E-04 | Service account compromise | Service-to-service | Stolen mTLS cert, Vault token | Low | High | Short-lived certs (24h), Vault TTL, rotation | Low |
| E-05 | CI/CD pipeline injection | Build artifacts | Malicious PR, compromised action | Medium | High | Signed commits, required reviews, SLSA L3 | Low |

---

## 4. ATT&CK Mapping (Cloud Matrix)

| Technique | Tactic | Threat IDs | Detection |
|---|---|---|---|
| T1556.001 (Password Spraying) | Credential Access | S-03 | Failed login rate, IP reputation |
| T1550.001 (Pass the Hash) | Credential Access | S-01, S-02 | Token reuse detection, short TTL |
| T1530 (Data from Cloud Storage) | Collection | I-02 | S3 access logs, anomalous download patterns |
| T1213 (Data from Information Repositories) | Collection | I-01, I-04 | API audit logs, RLS violation attempts |
| T1565.001 (Stored Data Manipulation) | Impact | T-01, T-02, T-03 | Audit log integrity checks, checksums |
| T1485 (Data Destruction) | Impact | R-04 | WORM verification, backup integrity |
| T1611 (Escape to Host) | Privilege Escalation | E-03 | Falco/sysdig alerts, container drift |
| T1610 (Deploy Container) | Persistence | E-05 | Image signing verification, admission control |
| T1589.001 (Active Directory Recon) | Reconnaissance | S-03 | WAF blocked requests, honeypot endpoints |
| T1595.001 (Active Scanning) | Reconnaissance | D-06 | Rate limit triggers, WAF blocks |

---

## 5. Attack Trees (Critical Paths)

### 5.1 Mastery Manipulation (T-01)

```
Mastery Manipulation
├── Direct DB Write
│   ├── Compromise DB credentials (Vault breach) → MITIGATED: Vault lease TTL, rotation
│   ├── SQL injection → MITIGATED: ORM only, no raw SQL
│   └── Insider threat → MITIGATED: RLS, audit log, 4-eyes
├── API Tampering
│   ├── JWT claim injection → MITIGATED: RS256, validation
│   ├── IDOR on /mastery endpoint → MITIGATED: RLS, ABAC
│   └── Worker compromise → MITIGATED: Least privilege, image signing
└── Client-side Calculation
    └── Client computes mastery → MITIGATED: Server-authoritative only
```

### 5.2 Audio Data Exfiltration (I-02)

```
Audio Exfiltration
├── S3 Bucket Misconfiguration
│   ├── Public bucket → MITIGATED: Block public access, CloudTrail monitoring
│   ├── Overly permissive policy → MITIGATED: IAM conditions, least privilege
│   └── Cross-account access → MITIGATED: External ID required
├── Presigned URL Leakage
│   ├── URL in logs → MITIGATED: No URLs in logs, structured logging
│   ├── URL in browser history → MITIGATED: 5min TTL, Referrer-Policy
│   └── Worker logs URL → MITIGATED: Structured logging, PII scrubbing
├── KMS Key Compromise
│   ├── Key policy too broad → MITIGATED: Least privilege, key rotation
│   └── Grant token theft → MITIGATED: Short TTL, context binding
└── Insider Access
    └── Admin downloads → MITIGATED: Audit log, 4-eyes, DLP
```

---

## 6. Risk Register (Prioritized)

| Risk ID | Threat | Inherent Risk | Residual Risk | Owner | Review Date |
|---|---|---|---|---|---|
| RISK-01 | Audio recording exfiltration (I-02) | **Critical** | Low | Security Team | Monthly |
| RISK-02 | Mastery/θ manipulation (T-01) | **High** | Low | Adaptive Team | Monthly |
| RISK-03 | Cross-learner data access (I-04) | **High** | Low | Platform Team | Monthly |
| RISK-04 | Credential stuffing (S-03) | **High** | Low | Security Team | Quarterly |
| RISK-05 | CI/CD supply chain (E-05) | **High** | Medium | Platform Team | Quarterly |
| RISK-06 | Container escape (E-03) | **Critical** | Low | Platform Team | Quarterly |
| RISK-07 | Consent record tampering (T-06) | **High** | Low | Legal/Security | Quarterly |
| RISK-08 | DoS on adaptive engine (D-01) | **Medium** | Low | Adaptive Team | Quarterly |

---

## 7. Security Test Cases (Derived from Threats)

| Test ID | Threat | Test Description | Automation |
|---|---|---|---|
| SEC-001 | S-01 | Attempt XSS via lesson content → verify CSP blocks execution | CI (Playwright) |
| SEC-002 | S-03 | 100 rapid login attempts → verify rate limit + CAPTCHA | CI (Locust) |
| SEC-003 | T-01 | POST /mastery with forged JWT → verify 403 + audit log | CI (pytest) |
| SEC-004 | T-02 | Submit practice with modified item_id → verify validation error | CI (pytest) |
| SEC-005 | I-02 | Generate presigned URL → wait 6min → verify 403 | CI (pytest) |
| SEC-006 | I-04 | Learner A requests /learners/B/profile → verify 403 | CI (pytest) |
| SEC-007 | D-01 | 1000 concurrent practice submissions → verify queue handles | Load test (k6) |
| SEC-008 | E-01 | Modify JWT `roles` claim → verify signature validation fails | CI (pytest) |
| SEC-009 | R-01 | Delete audit log entry → verify WORM constraint violation | CI (pytest) |
| SEC-010 | I-03 | Trigger error with PII in request → verify logs scrubbed | CI (pytest) |

---

## 8. Assumptions & Out of Scope

| Assumption | Validation |
|---|---|
| Cloudflare WAF blocks known attack patterns | Verified via WAF logs |
| AWS KMS is FIPS 140-2 Level 3 compliant | AWS certification |
| PostgreSQL RLS is correctly configured | Integration tests per table |
| Istio mTLS terminates at sidecar | Verified via `istioctl x authz check` |
| Learner devices are not rooted/jailbroken | Cannot enforce; defense in depth |

**Out of Scope:**
- Physical security of AWS data centers
- Supply chain attacks on upstream dependencies (mitigated by pinning + scanning)
- Nation-state APT (assume breach, focus on detection/response)
- Social engineering of learners (education, not technical control)

---

## 9. Review Cadence

| Review | Frequency | Participants |
|---|---|---|
| Threat model walkthrough | Quarterly | Security Lead, Platform Lead, Adaptive Lead |
| STRIDE re-assessment | Per major release | Security Team |
| ATT&CK coverage gap analysis | Semi-annually | Security Team |
| Penetration test | Annually | External vendor |
| Red team exercise | Annually | External vendor |

---

*This threat model is a living document. Update on: architecture changes, new data flows, incidents, pen test findings.*