"""
Database models - Core ORM models matching the ERD specification.

Tables:
- learners: User accounts and profiles
- diagnostic_results: Placement test results
- diagnostic_responses: Individual item responses
- mastery_history: BKT mastery tracking per skill
- theta_estimates: IRT ability estimates per domain
- fsrs_cards: FSRS scheduling state per item
- practice_sessions: Post-lesson practice session records
- practice_responses: Individual practice item responses
- content_lessons: Lesson metadata (loaded from content repo)
- content_packs: Practice pack metadata (loaded from content repo)
"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import (
    JSON,
    BigInteger,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from its_platform.db.session import Base


class CEFRLevel(str, PyEnum):
    """CEFR proficiency levels."""
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class SkillDomain(str, PyEnum):
    """Skill domains for adaptive engine."""
    GRAMMAR = "grammar"
    VOCABULARY = "vocabulary"
    READING = "reading"
    LISTENING = "listening"
    WRITING = "writing"
    SPEAKING = "speaking"
    PRONUNCIATION = "pronunciation"


class DiagnosticStatus(str, PyEnum):
    """Diagnostic test status."""
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class PracticeItemType(str, PyEnum):
    """Practice item types."""
    MULTIPLE_CHOICE = "multiple_choice"
    FILL_IN_BLANK = "fill_in_blank"
    MINIMAL_PAIR = "minimal_pair"
    PRODUCTION = "production"
    LISTENING_COMPREHENSION = "listening_comprehension"


class Learner(Base):
    """Learner/user account."""

    __tablename__ = "learners"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    native_language: Mapped[str] = mapped_column(String(10), default="pt-BR")
    target_language: Mapped[str] = mapped_column(String(10), default="en-US")
    current_cefr: Mapped[Optional[CEFRLevel]] = mapped_column(Enum(CEFRLevel), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), default="America/Sao_Paulo")
    is_active: Mapped[bool] = mapped_column(default=True)
    is_verified: Mapped[bool] = mapped_column(default=False)
    consent_given_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    consent_version: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    diagnostic_results: Mapped[list["DiagnosticResult"]] = relationship(back_populates="learner")
    mastery_history: Mapped[list["MasteryHistory"]] = relationship(back_populates="learner")
    theta_estimates: Mapped[list["ThetaEstimate"]] = relationship(back_populates="learner")
    fsrs_cards: Mapped[list["FSRSCard"]] = relationship(back_populates="learner")
    practice_sessions: Mapped[list["PracticeSession"]] = relationship(back_populates="learner")

    __table_args__ = (
        Index("ix_learners_email_active", "email", "is_active"),
    )


class DiagnosticResult(Base):
    """Diagnostic/placement test result."""

    __tablename__ = "diagnostic_results"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    learner_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("learners.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[DiagnosticStatus] = mapped_column(Enum(DiagnosticStatus), default=DiagnosticStatus.IN_PROGRESS)
    start_node: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    final_theta: Mapped[Optional[float]] = mapped_column(Numeric(5, 3), nullable=True)
    final_se: Mapped[Optional[float]] = mapped_column(Numeric(5, 3), nullable=True)
    ci_lower: Mapped[Optional[float]] = mapped_column(Numeric(5, 3), nullable=True)
    ci_upper: Mapped[Optional[float]] = mapped_column(Numeric(5, 3), nullable=True)
    items_administered: Mapped[int] = mapped_column(Integer, default=0)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    learner: Mapped["Learner"] = relationship(back_populates="diagnostic_results")
    responses: Mapped[list["DiagnosticResponse"]] = relationship(back_populates="diagnostic", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_diagnostic_results_learner_status", "learner_id", "status"),
    )


class DiagnosticResponse(Base):
    """Individual diagnostic item response."""

    __tablename__ = "diagnostic_responses"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    diagnostic_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("diagnostic_results.id", ondelete="CASCADE"), nullable=False)
    item_id: Mapped[str] = mapped_column(String(100), nullable=False)
    skill_domain: Mapped[SkillDomain] = mapped_column(Enum(SkillDomain), nullable=False)
    difficulty: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    discrimination: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    is_correct: Mapped[bool] = mapped_column(nullable=False)
    response_time_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    theta_estimate: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    se_estimate: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    diagnostic: Mapped["DiagnosticResult"] = relationship(back_populates="responses")

    __table_args__ = (
        Index("ix_diagnostic_responses_diagnostic_item", "diagnostic_id", "item_id"),
    )


class MasteryHistory(Base):
    """BKT mastery tracking per skill."""

    __tablename__ = "mastery_history"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    learner_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("learners.id", ondelete="CASCADE"), nullable=False)
    skill_id: Mapped[str] = mapped_column(String(100), nullable=False)
    skill_domain: Mapped[SkillDomain] = mapped_column(Enum(SkillDomain), nullable=False)
    mastery_probability: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    learn_rate: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    guess_rate: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    slip_rate: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    observations_count: Mapped[int] = mapped_column(Integer, default=0)
    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    last_practiced_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    learner: Mapped["Learner"] = relationship(back_populates="mastery_history")

    __table_args__ = (
        UniqueConstraint("learner_id", "skill_id", name="uq_mastery_learner_skill"),
        Index("ix_mastery_history_learner_domain", "learner_id", "skill_domain"),
    )


class ThetaEstimate(Base):
    """IRT ability estimate (theta) per domain."""

    __tablename__ = "theta_estimates"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    learner_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("learners.id", ondelete="CASCADE"), nullable=False)
    domain: Mapped[SkillDomain] = mapped_column(Enum(SkillDomain), nullable=False)
    theta: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    se: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    ci_lower: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    ci_upper: Mapped[float] = mapped_column(Numeric(5, 3), nullable=False)
    items_administered: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    learner: Mapped["Learner"] = relationship(back_populates="theta_estimates")

    __table_args__ = (
        UniqueConstraint("learner_id", "domain", name="uq_theta_learner_domain"),
    )


class FSRSCard(Base):
    """FSRS scheduling state per practice item."""

    __tablename__ = "fsrs_cards"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    learner_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("learners.id", ondelete="CASCADE"), nullable=False)
    item_id: Mapped[str] = mapped_column(String(100), nullable=False)
    skill_id: Mapped[str] = mapped_column(String(100), nullable=False)
    skill_domain: Mapped[SkillDomain] = mapped_column(Enum(SkillDomain), nullable=False)
    stability: Mapped[float] = mapped_column(Numeric(8, 4), nullable=False)
    difficulty: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    due_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    last_review: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    reps: Mapped[int] = mapped_column(Integer, default=0)
    lapses: Mapped[int] = mapped_column(Integer, default=0)
    state: Mapped[int] = mapped_column(Integer, default=0)  # 0=new, 1=learning, 2=review, 3=relearning
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    learner: Mapped["Learner"] = relationship(back_populates="fsrs_cards")

    __table_args__ = (
        UniqueConstraint("learner_id", "item_id", name="uq_fsrs_learner_item"),
        Index("ix_fsrs_cards_learner_due", "learner_id", "due_date"),
        Index("ix_fsrs_cards_learner_skill", "learner_id", "skill_id"),
    )


class PracticeSession(Base):
    """Post-lesson practice session record."""

    __tablename__ = "practice_sessions"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    learner_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("learners.id", ondelete="CASCADE"), nullable=False)
    lesson_id: Mapped[str] = mapped_column(String(100), nullable=False)
    pack_id: Mapped[str] = mapped_column(String(100), nullable=False)
    pack_version: Mapped[str] = mapped_column(String(20), nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    total_items: Mapped[int] = mapped_column(Integer, default=0)
    correct_items: Mapped[int] = mapped_column(Integer, default=0)
    mastery_gained: Mapped[Optional[float]] = mapped_column(Numeric(5, 4), nullable=True)

    # Relationships
    learner: Mapped["Learner"] = relationship(back_populates="practice_sessions")
    responses: Mapped[list["PracticeResponse"]] = relationship(back_populates="session", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_practice_sessions_learner_lesson", "learner_id", "lesson_id"),
    )


class PracticeResponse(Base):
    """Individual practice item response."""

    __tablename__ = "practice_responses"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    session_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("practice_sessions.id", ondelete="CASCADE"), nullable=False)
    item_id: Mapped[str] = mapped_column(String(100), nullable=False)
    item_type: Mapped[PracticeItemType] = mapped_column(Enum(PracticeItemType), nullable=False)
    skill_id: Mapped[str] = mapped_column(String(100), nullable=False)
    skill_domain: Mapped[SkillDomain] = mapped_column(Enum(SkillDomain), nullable=False)
    is_correct: Mapped[bool] = mapped_column(nullable=False)
    response_time_ms: Mapped[int] = mapped_column(Integer, nullable=False)
    user_answer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    expected_answer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session: Mapped["PracticeSession"] = relationship(back_populates="responses")

    __table_args__ = (
        Index("ix_practice_responses_session_item", "session_id", "item_id"),
    )


class ContentLesson(Base):
    """Lesson metadata loaded from content repository."""

    __tablename__ = "content_lessons"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)  # e.g., "les_a1_greetings"
    module_id: Mapped[str] = mapped_column(String(100), nullable=False)
    cefr_level: Mapped[CEFRLevel] = mapped_column(Enum(CEFRLevel), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    skill_domains: Mapped[list[str]] = mapped_column(JSON, default=list)
    prerequisites: Mapped[list[str]] = mapped_column(JSON, default=list)
    estimated_duration_min: Mapped[int] = mapped_column(Integer, default=15)
    reuse_basis: Mapped[str] = mapped_column(String(50), nullable=False)
    source_references: Mapped[list[str]] = mapped_column(JSON, default=list)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)  # SHA256
    is_active: Mapped[bool] = mapped_column(default=True)
    loaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("ix_content_lessons_module", "module_id"),
        Index("ix_content_lessons_cefr", "cefr_level"),
    )


class ContentPack(Base):
    """Practice pack metadata loaded from content repository."""

    __tablename__ = "content_packs"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)  # e.g., "pack_les_a1_greetings_v1"
    lesson_id: Mapped[str] = mapped_column(String(100), ForeignKey("content_lessons.id"), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)
    schema_version: Mapped[str] = mapped_column(String(20), nullable=False)
    item_count: Mapped[int] = mapped_column(Integer, default=0)
    skill_domains: Mapped[list[str]] = mapped_column(JSON, default=list)
    reuse_basis: Mapped[str] = mapped_column(String(50), nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    loaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("ix_content_packs_lesson", "lesson_id"),
    )