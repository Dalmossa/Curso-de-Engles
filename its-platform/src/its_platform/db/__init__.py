"""
Database initialization and migration utilities.
"""

from its_platform.db.session import Base, create_engine, init_db, close_db
from its_platform.db.models import (
    Learner,
    DiagnosticResult,
    DiagnosticResponse,
    MasteryHistory,
    ThetaEstimate,
    FSRSCard,
    PracticeSession,
    PracticeResponse,
    ContentLesson,
    ContentPack,
)

__all__ = [
    "Base",
    "create_engine",
    "init_db",
    "close_db",
    "Learner",
    "DiagnosticResult",
    "DiagnosticResponse",
    "MasteryHistory",
    "ThetaEstimate",
    "FSRSCard",
    "PracticeSession",
    "PracticeResponse",
    "ContentLesson",
    "ContentPack",
]