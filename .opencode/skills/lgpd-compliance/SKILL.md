---
name: LGPD Compliance
description: LGPD (Lei 13.709/2018) compliance implementation for ITS Platform
---

# LGPD Compliance Skill — ITS Platform

## When to Use
- Implementing data subject rights
- Configuring consent management
- Data processing records (ROPA)
- Data Protection Impact Assessment (DPIA)
- International transfer safeguards

## LGPD Requirements Mapping

| LGPD Article | Requirement | Implementation | Status |
|--------------|-------------|----------------|--------|
| Art. 7 | Lawful basis | Consent, legitimate interest, contract | ✅ |
| Art. 8 | Consent conditions | Granular, revocable, informed | ✅ |
| Art. 9 | Sensitive data | Explicit consent for audio/biometric | ✅ |
| Art. 11 | Data subject rights | Access, rectification, erasure, portability | ✅ |
| Art. 12 | Right to information | Transparent privacy notices | ✅ |
| Art. 16 | Data security | Encryption, access controls, audit | ✅ |
| Art. 18 | Accountability | DPO, ROPA, DPIA | 🟡 |
| Art. 46 | International transfers | SCCs, adequacy decisions | ✅ |
| Art. 48 | DPO appointment | Named DPO with contact | 🟡 |

## Implementation

### 1. Lawful Basis Mapping
```python
# its_platform/security/lawful_basis.py
from enum import Enum

class LawfulBasis(Enum):
    CONSENT = "consent"                    # Art. 7, I
    CONTRACT = "contract"                  # Art. 7, V
    LEGAL_OBLIGATION = "legal_obligation"  # Art. 7, II
    VITAL_INTERESTS = "vital_interests"    # Art. 7, III
    PUBLIC_TASK = "public_task"            # Art. 7, IV
    LEGITIMATE_INTEREST = "legitimate_interest"  # Art. 7, IX

LAWFUL_BASIS_MAP = {
    "adaptive_learning": LawfulBasis.CONTRACT,
    "diagnostic_placement": LawfulBasis.CONTRACT,
    "practice_submission": LawfulBasis.CONTRACT,
    "listening_audio": LawfulBasis.CONSENT,           # Sensitive data (biometric)
    "pronunciation_audio": LawfulBasis.CONSENT,       # Sensitive data (biometric)
    "progress_analytics": LawfulBasis.LEGITIMATE_INTEREST,
    "marketing_emails": LawfulBasis.CONSENT,
    "security_monitoring": LawfulBasis.LEGAL_OBLIGATION,
}
```

### 2. Consent Management
```python
# its_platform/db/models/consent.py
from sqlalchemy import Enum as SQLEnum
from its_platform.security.lawful_basis import LawfulBasis

class Consent(Base):
    __tablename__ = "consents"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    learner_id = Column(UUID, ForeignKey("learners.id", ondelete="CASCADE"), nullable=False)
    purpose = Column(SQLEnum(LawfulBasis), nullable=False)
    granted = Column(Boolean, nullable=False)
    granted_at = Column(TIMESTAMP(timezone=True))
    withdrawn_at = Column(TIMESTAMP(timezone=True))
    version = Column(String(20), nullable=False)  # Privacy policy version
    ip_hash = Column(CHAR(64))   # SHA-256 of IP at consent time
    user_agent_hash = Column(CHAR(64))
    
    __table_args__ = (
        UniqueConstraint("learner_id", "purpose", "version", name="uq_consent_learner_purpose_version"),
    )
```

```python
# its_platform/services/consent_service.py
class ConsentService:
    async def grant_consent(self, learner_id: UUID, purpose: LawfulBasis, version: str, request: Request) -> Consent:
        consent = Consent(
            learner_id=learner_id,
            purpose=purpose,
            granted=True,
            granted_at=datetime.utcnow(),
            version=version,
            ip_hash=hash_ip(request.client.host),
            user_agent_hash=hash_ua(request.headers.get("user-agent", "")),
        )
        await self.db.add(consent)
        return consent
    
    async def withdraw_consent(self, learner_id: UUID, purpose: LawfulBasis) -> Consent:
        consent = await self.get_active_consent(learner_id, purpose)
        consent.granted = False
        consent.withdrawn_at = datetime.utcnow()
        # Trigger data deletion for this purpose
        await self.trigger_data_deletion(learner_id, purpose)
        return consent
    
    async def check_consent(self, learner_id: UUID, purpose: LawfulBasis) -> bool:
        consent = await self.get_active_consent(learner_id, purpose)
        return consent is not None and consent.granted
```

### 3. Data Subject Rights API
```python
# its_platform/api/v1/privacy.py
from fastapi import APIRouter, Depends
from its_platform.services.privacy_service import PrivacyService

router = APIRouter(prefix="/v1/me", tags=["privacy"])

@router.get("/data-export")
async def export_data(learner_id: UUID = Depends(get_current_learner), privacy: PrivacyService = Depends()):
    """LGPD Art. 18 - Right to access & portability"""
    return await privacy.export_learner_data(learner_id)

@router.delete("/account")
async def delete_account(learner_id: UUID = Depends(get_current_learner), privacy: PrivacyService = Depends()):
    """LGPD Art. 18 - Right to erasure"""
    await privacy.delete_learner_data(learner_id)
    return {"message": "Account and data scheduled for deletion"}

@router.patch("/consent/{purpose}")
async def update_consent(
    purpose: LawfulBasis, 
    granted: bool, 
    learner_id: UUID = Depends(get_current_learner),
    consent: ConsentService = Depends()
):
    """LGPD Art. 8 - Consent management"""
    if granted:
        return await consent.grant_consent(learner_id, purpose, get_privacy_version())
    return await consent.withdraw_consent(learner_id, purpose)

@router.post("/restrict-processing")
async def restrict_processing(learner_id: UUID = Depends(get_current_learner), privacy: PrivacyService = Depends()):
    """LGPD Art. 18 - Right to restriction"""
    return await privacy.restrict_processing(learner_id)
```

### 4. DPIA for High-Risk Processing (Audio)
```python
# its_platform/security/dpia.py
from dataclasses import dataclass

@dataclass
class DPIA:
    processing_activity: str
    necessity_proportionality: str
    risks: list[dict]
    mitigation_measures: list[dict]
    dpo_opinion: str
    approved: bool
    approved_at: datetime | None

AUDIO_DPIA = DPIA(
    processing_activity="Pronunciation assessment via audio recording and ASR",
    necessity_proportionality="Required for core product feature (pronunciation feedback). Minimal data: audio snippet only during active exercise.",
    risks=[
        {"risk": "Biometric data breach", "likelihood": "Low", "impact": "Critical"},
        {"risk": "Function creep", "likelihood": "Medium", "impact": "High"},
        {"risk": "Unauthorized access by staff", "likelihood": "Low", "impact": "High"},
    ],
    mitigation_measures=[
        {"measure": "Field-level AES-256 encryption", "control": "Technical"},
        {"measure": "30-day auto-deletion", "control": "Technical/Organizational"},
        {"measure": "Explicit consent per session", "control": "Organizational"},
        {"measure": "Access logging + hash-chained audit", "control": "Technical"},
        {"measure": "DPO review quarterly", "control": "Organizational"},
    ],
    dpo_opinion="Acceptable with mitigations. Recommended: annual re-assessment.",
    approved=True,
    approved_at=datetime(2026, 1, 15),
)
```

### 5. Records of Processing Activities (ROPA)
```python
# its_platform/security/ropa.py
from dataclasses import dataclass
from typing import List

@dataclass
class ProcessingActivity:
    name: str
    purpose: str
    lawful_basis: str
    data_categories: List[str]
    data_subjects: List[str]
    recipients: List[str]
    retention_period: str
    security_measures: List[str]
    international_transfer: bool
    transfer_safeguards: List[str]

ROPA = [
    ProcessingActivity(
        name="Adaptive Learning",
        purpose="Personalize learning path via BKT/IRT/FSRS",
        lawful_basis="Contract (Art. 7, V)",
        data_categories=["Mastery scores", "Theta estimates", "FSRS states", "Practice responses"],
        data_subjects=["Learners"],
        recipients=["Internal: Adaptive Engine, Curriculum Service"],
        retention_period="Account lifetime + 1 year",
        security_measures=["AES-256 at rest", "TLS 1.3 in transit", "RLS", "Audit logging"],
        international_transfer=False,
        transfer_safeguards=[],
    ),
    ProcessingActivity(
        name="Pronunciation Assessment",
        purpose="ASR scoring of pronunciation exercises",
        lawful_basis="Explicit Consent (Art. 7, I; Art. 11)",
        data_categories=["Audio recordings (biometric)", "ASR transcripts", "Pronunciation scores"],
        data_subjects=["Learners"],
        recipients=["Internal: ASR Worker, Adaptive Engine"],
        retention_period="30 days (auto-delete)",
        security_measures=["Field-level AES-256", "KMS envelope encryption", "Signed URLs (5min TTL)", "Consent gate"],
        international_transfer=False,
        transfer_safeguards=[],
    ),
]
```

### 6. International Transfer Safeguards
```python
# its_platform/security/transfers.py
class TransferSafeguard:
    ADEQUACY_DECISION = "adequacy"      # Art. 46, II
    STANDARD_CONTRACTUAL_CLAUSES = "scc"  # Art. 46, III
    BINDING_CORPORATE_RULES = "bcr"      # Art. 46, IV
    CERTIFICATION = "certification"      # Art. 46, VII

TRANSFER_MAP = {
    "aws_us_east_1": TransferSafeguard.STANDARD_CONTRACTUAL_CLAUSES,
    "aws_us_west_2": TransferSafeguard.STANDARD_CONTRACTUAL_CLAUSES,
    "github_actions": TransferSafeguard.STANDARD_CONTRACTUAL_CLAUSES,
}
```

## Validation Checklist
- [ ] Lawful basis documented for all processing
- [ ] Granular consent with versioning and withdrawal
- [ ] Data subject rights API (access, rectification, erasure, portability, restriction, objection)
- [ ] DPIA completed for audio/biometric processing
- [ ] ROPA documented and current
- [ ] DPO appointed with public contact
- [ ] International transfers use SCCs
- [ ] Data retention policies enforced (auto-delete)
- [ ] Privacy policy versioned and accessible
- [ ] Breach notification procedure (72h to ANPD)