"""
Application configuration management.

Uses Pydantic Settings for environment-based configuration with validation.
All secrets MUST come from environment variables - no defaults for secrets.
"""

from functools import lru_cache
from typing import List, Optional

from pydantic import Field, PostgresDsn, RedisDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ------------------------------------------------------------------
    # Application
    # ------------------------------------------------------------------
    APP_NAME: str = "ITS Platform"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = Field(default="development", pattern="^(development|staging|production)$")
    DEBUG: bool = False
    LOG_LEVEL: str = Field(default="INFO", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$")

    # ------------------------------------------------------------------
    # API Server
    # ------------------------------------------------------------------
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1

    # ------------------------------------------------------------------
    # Security (NO DEFAULTS FOR SECRETS)
    # ------------------------------------------------------------------
    SECRET_KEY: str = Field(..., min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    PASSWORD_HASH_ROUNDS: int = 12

    # CORS
    CORS_ORIGINS: List[str] = Field(default_factory=list)
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = Field(default_factory=lambda: ["*"])
    CORS_ALLOW_HEADERS: List[str] = Field(default_factory=lambda: ["*"])

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------
    DATABASE_URL: PostgresDsn = Field(...)
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30
    DATABASE_ECHO: bool = False

    @computed_field
    @property
    def DATABASE_URL_ASYNC(self) -> str:
        """Return async-compatible database URL."""
        url = str(self.DATABASE_URL)
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    # ------------------------------------------------------------------
    # Redis
    # ------------------------------------------------------------------
    REDIS_URL: RedisDsn = Field(...)
    REDIS_MAX_CONNECTIONS: int = 50
    REDIS_SOCKET_TIMEOUT: int = 5
    REDIS_SOCKET_CONNECT_TIMEOUT: int = 5

    # ------------------------------------------------------------------
    # Celery
    # ------------------------------------------------------------------
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_RESULT_SERIALIZER: str = "json"
    CELERY_ACCEPT_CONTENT: List[str] = Field(default_factory=lambda: ["json"])
    CELERY_TIMEZONE: str = "UTC"
    CELERY_TASK_TRACK_STARTED: bool = True
    CELERY_TASK_TIME_LIMIT: int = 300
    CELERY_WORKER_PREFETCH_MULTIPLIER: int = 4

    @computed_field
    @property
    def CELERY_BROKER_URL_COMPUTED(self) -> str:
        return self.CELERY_BROKER_URL or str(self.REDIS_URL)

    @computed_field
    @property
    def CELERY_RESULT_BACKEND_COMPUTED(self) -> str:
        return self.CELERY_RESULT_BACKEND or str(self.REDIS_URL)

    # ------------------------------------------------------------------
    # Content Repository (Submodule)
    # ------------------------------------------------------------------
    CONTENT_REPO_PATH: str = Field(default="../content")
    CONTENT_VERIFY_ON_STARTUP: bool = True

    # ------------------------------------------------------------------
    # Adaptive Engine
    # ------------------------------------------------------------------
    BKT_LEARN_RATE_DEFAULT: float = 0.3
    BKT_GUESS_RATE_DEFAULT: float = 0.2
    BKT_SLIP_RATE_DEFAULT: float = 0.1
    BKT_MASTERY_THRESHOLD: float = 0.85

    IRT_DISCRIMINATION_PRIOR: float = 1.0
    IRT_DIFFICULTY_PRIOR: float = 0.0
    IRT_CAT_SE_THRESHOLD: float = 0.3
    IRT_CAT_MAX_ITEMS: int = 30

    FSRS_DESIRED_RETENTION: float = 0.9
    FSRS_LEARNING_STEPS: List[int] = Field(default_factory=lambda: [1, 10])
    FSRS_RELEARNING_STEPS: List[int] = Field(default_factory=lambda: [10])

    # ------------------------------------------------------------------
    # Observability
    # ------------------------------------------------------------------
    OTEL_SERVICE_NAME: str = "its-platform"
    OTEL_EXPORTER_OTLP_ENDPOINT: Optional[str] = None
    OTEL_EXPORTER_OTLP_HEADERS: Optional[str] = None
    PROMETHEUS_METRICS_PORT: int = 9090

    # ------------------------------------------------------------------
    # External Services
    # ------------------------------------------------------------------
    ASR_SERVICE_URL: Optional[str] = None
    ASR_API_KEY: Optional[str] = None
    TTS_SERVICE_URL: Optional[str] = None
    STORAGE_BUCKET: Optional[str] = None
    STORAGE_REGION: Optional[str] = None

    # ------------------------------------------------------------------
    # Kong Gateway
    # ------------------------------------------------------------------
    KONG_ADMIN_URL: Optional[str] = None
    KONG_PROXY_URL: Optional[str] = None

    # ------------------------------------------------------------------
    # Feature Flags
    # ------------------------------------------------------------------
    ENABLE_LISTENING_SERVICE: bool = True
    ENABLE_PRONUNCIATION_ASR: bool = False
    ENABLE_SHADOW_CAT: bool = False
    ENABLE_A_B_TESTING: bool = False


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()