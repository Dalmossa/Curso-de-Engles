"""
Initial migration - Create all tables.

Revision ID: 001
Revises: 
Create Date: 2026-10-04
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create enum types
    cefr_level_enum = sa.Enum("A1", "A2", "B1", "B2", "C1", "C2", name="cefr_level")
    skill_domain_enum = sa.Enum(
        "grammar", "vocabulary", "reading", "listening", "writing", "speaking", "pronunciation",
        name="skill_domain"
    )
    diagnostic_status_enum = sa.Enum("in_progress", "completed", "abandoned", name="diagnostic_status")
    practice_item_type_enum = sa.Enum(
        "multiple_choice", "fill_in_blank", "minimal_pair", "production", "listening_comprehension",
        name="practice_item_type"
    )

    cefr_level_enum.create(op.get_bind(), checkfirst=True)
    skill_domain_enum.create(op.get_bind(), checkfirst=True)
    diagnostic_status_enum.create(op.get_bind(), checkfirst=True)
    practice_item_type_enum.create(op.get_bind(), checkfirst=True)

    # Learners table
    op.create_table(
        "learners",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("native_language", sa.String(10), nullable=False, server_default="pt-BR"),
        sa.Column("target_language", sa.String(10), nullable=False, server_default="en-US"),
        sa.Column("current_cefr", cefr_level_enum, nullable=True),
        sa.Column("timezone", sa.String(50), nullable=False, server_default="America/Sao_Paulo"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("consent_given_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("consent_version", sa.String(20), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_learners_email_active", "learners", ["email", "is_active"])

    # Diagnostic Results
    op.create_table(
        "diagnostic_results",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("learner_id", UUID(as_uuid=True), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", diagnostic_status_enum, nullable=False, server_default="in_progress"),
        sa.Column("start_node", sa.String(100), nullable=True),
        sa.Column("final_theta", sa.Numeric(5, 3), nullable=True),
        sa.Column("final_se", sa.Numeric(5, 3), nullable=True),
        sa.Column("ci_lower", sa.Numeric(5, 3), nullable=True),
        sa.Column("ci_upper", sa.Numeric(5, 3), nullable=True),
        sa.Column("items_administered", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_diagnostic_results_learner_status", "diagnostic_results", ["learner_id", "status"])

    # Diagnostic Responses
    op.create_table(
        "diagnostic_responses",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("diagnostic_id", UUID(as_uuid=True), sa.ForeignKey("diagnostic_results.id", ondelete="CASCADE"), nullable=False),
        sa.Column("item_id", sa.String(100), nullable=False),
        sa.Column("skill_domain", skill_domain_enum, nullable=False),
        sa.Column("difficulty", sa.Numeric(5, 3), nullable=False),
        sa.Column("discrimination", sa.Numeric(5, 3), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("response_time_ms", sa.Integer(), nullable=False),
        sa.Column("theta_estimate", sa.Numeric(5, 3), nullable=False),
        sa.Column("se_estimate", sa.Numeric(5, 3), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_diagnostic_responses_diagnostic_item", "diagnostic_responses", ["diagnostic_id", "item_id"])

    # Mastery History
    op.create_table(
        "mastery_history",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("learner_id", UUID(as_uuid=True), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("skill_id", sa.String(100), nullable=False),
        sa.Column("skill_domain", skill_domain_enum, nullable=False),
        sa.Column("mastery_probability", sa.Numeric(5, 4), nullable=False),
        sa.Column("learn_rate", sa.Numeric(5, 4), nullable=False),
        sa.Column("guess_rate", sa.Numeric(5, 4), nullable=False),
        sa.Column("slip_rate", sa.Numeric(5, 4), nullable=False),
        sa.Column("observations_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("correct_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_practiced_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_unique_constraint("uq_mastery_learner_skill", "mastery_history", ["learner_id", "skill_id"])
    op.create_index("ix_mastery_history_learner_domain", "mastery_history", ["learner_id", "skill_domain"])

    # Theta Estimates
    op.create_table(
        "theta_estimates",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("learner_id", UUID(as_uuid=True), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("domain", skill_domain_enum, nullable=False),
        sa.Column("theta", sa.Numeric(5, 3), nullable=False),
        sa.Column("se", sa.Numeric(5, 3), nullable=False),
        sa.Column("ci_lower", sa.Numeric(5, 3), nullable=False),
        sa.Column("ci_upper", sa.Numeric(5, 3), nullable=False),
        sa.Column("items_administered", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_unique_constraint("uq_theta_learner_domain", "theta_estimates", ["learner_id", "domain"])

    # FSRS Cards
    op.create_table(
        "fsrs_cards",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("learner_id", UUID(as_uuid=True), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("item_id", sa.String(100), nullable=False),
        sa.Column("skill_id", sa.String(100), nullable=False),
        sa.Column("skill_domain", skill_domain_enum, nullable=False),
        sa.Column("stability", sa.Numeric(8, 4), nullable=False),
        sa.Column("difficulty", sa.Numeric(5, 4), nullable=False),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_review", sa.DateTime(timezone=True), nullable=True),
        sa.Column("reps", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("lapses", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("state", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_unique_constraint("uq_fsrs_learner_item", "fsrs_cards", ["learner_id", "item_id"])
    op.create_index("ix_fsrs_cards_learner_due", "fsrs_cards", ["learner_id", "due_date"])
    op.create_index("ix_fsrs_cards_learner_skill", "fsrs_cards", ["learner_id", "skill_id"])

    # Practice Sessions
    op.create_table(
        "practice_sessions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("learner_id", UUID(as_uuid=True), sa.ForeignKey("learners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lesson_id", sa.String(100), nullable=False),
        sa.Column("pack_id", sa.String(100), nullable=False),
        sa.Column("pack_version", sa.String(20), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("total_items", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("correct_items", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("mastery_gained", sa.Numeric(5, 4), nullable=True),
    )
    op.create_index("ix_practice_sessions_learner_lesson", "practice_sessions", ["learner_id", "lesson_id"])

    # Practice Responses
    op.create_table(
        "practice_responses",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("session_id", UUID(as_uuid=True), sa.ForeignKey("practice_sessions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("item_id", sa.String(100), nullable=False),
        sa.Column("item_type", practice_item_type_enum, nullable=False),
        sa.Column("skill_id", sa.String(100), nullable=False),
        sa.Column("skill_domain", skill_domain_enum, nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("response_time_ms", sa.Integer(), nullable=False),
        sa.Column("user_answer", sa.Text(), nullable=True),
        sa.Column("expected_answer", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_practice_responses_session_item", "practice_responses", ["session_id", "item_id"])

    # Content Lessons
    op.create_table(
        "content_lessons",
        sa.Column("id", sa.String(100), primary_key=True),
        sa.Column("module_id", sa.String(100), nullable=False),
        sa.Column("cefr_level", cefr_level_enum, nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("skill_domains", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("prerequisites", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("estimated_duration_min", sa.Integer(), nullable=False, server_default="15"),
        sa.Column("reuse_basis", sa.String(50), nullable=False),
        sa.Column("source_references", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("content_hash", sa.String(64), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("loaded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_content_lessons_module", "content_lessons", ["module_id"])
    op.create_index("ix_content_lessons_cefr", "content_lessons", ["cefr_level"])

    # Content Packs
    op.create_table(
        "content_packs",
        sa.Column("id", sa.String(100), primary_key=True),
        sa.Column("lesson_id", sa.String(100), sa.ForeignKey("content_lessons.id"), nullable=False),
        sa.Column("version", sa.String(20), nullable=False),
        sa.Column("schema_version", sa.String(20), nullable=False),
        sa.Column("item_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("skill_domains", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("reuse_basis", sa.String(50), nullable=False),
        sa.Column("content_hash", sa.String(64), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("loaded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_content_packs_lesson", "content_packs", ["lesson_id"])


def downgrade() -> None:
    op.drop_table("content_packs")
    op.drop_table("content_lessons")
    op.drop_table("practice_responses")
    op.drop_table("practice_sessions")
    op.drop_table("fsrs_cards")
    op.drop_table("theta_estimates")
    op.drop_table("mastery_history")
    op.drop_table("diagnostic_responses")
    op.drop_table("diagnostic_results")
    op.drop_table("learners")

    # Drop enums
    sa.Enum(name="practice_item_type").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="diagnostic_status").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="skill_domain").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="cefr_level").drop(op.get_bind(), checkfirst=True)