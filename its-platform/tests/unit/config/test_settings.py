"""
Unit tests for Configuration.
"""

import os
from unittest.mock import patch

import pytest
from pydantic import ValidationError

from its_platform.config import Settings


class TestSettings:
    """Test application settings."""

    def test_settings_load_from_env(self):
        """Test settings load from environment variables."""
        env_vars = {
            "APP_NAME": "Test ITS",
            "ENVIRONMENT": "testing",
            "DEBUG": "true",
            "SECRET_KEY": "a" * 32,
            "DATABASE_URL": "postgresql://test:test@localhost:5432/test",
            "REDIS_URL": "redis://localhost:6379/0",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            settings = Settings()

            assert settings.APP_NAME == "Test ITS"
            assert settings.ENVIRONMENT == "testing"
            assert settings.DEBUG is True
            assert settings.SECRET_KEY == "a" * 32

    def test_settings_require_secret_key(self):
        """Test that SECRET_KEY is required (no default)."""
        env_vars = {
            "DATABASE_URL": "postgresql://test:test@localhost:5432/test",
            "REDIS_URL": "redis://localhost:6379/0",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            with pytest.raises(ValidationError) as exc_info:
                Settings()
            assert "SECRET_KEY" in str(exc_info.value)

    def test_settings_require_database_url(self):
        """Test that DATABASE_URL is required."""
        env_vars = {
            "SECRET_KEY": "a" * 32,
            "REDIS_URL": "redis://localhost:6379/0",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            with pytest.raises(ValidationError) as exc_info:
                Settings()
            assert "DATABASE_URL" in str(exc_info.value)

    def test_settings_require_redis_url(self):
        """Test that REDIS_URL is required."""
        env_vars = {
            "SECRET_KEY": "a" * 32,
            "DATABASE_URL": "postgresql://test:test@localhost:5432/test",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            with pytest.raises(ValidationError) as exc_info:
                Settings()
            assert "REDIS_URL" in str(exc_info.value)

    def test_database_url_async_property(self):
        """Test async database URL property."""
        env_vars = {
            "SECRET_KEY": "a" * 32,
            "DATABASE_URL": "postgresql://user:pass@localhost:5432/db",
            "REDIS_URL": "redis://localhost:6379/0",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            settings = Settings()
            assert settings.DATABASE_URL_ASYNC == "postgresql+asyncpg://user:pass@localhost:5432/db"

    def test_celery_urls_fallback_to_redis(self):
        """Test Celery URLs fall back to Redis."""
        env_vars = {
            "SECRET_KEY": "a" * 32,
            "DATABASE_URL": "postgresql://user:pass@localhost:5432/db",
            "REDIS_URL": "redis://localhost:6379/0",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            settings = Settings()
            assert settings.CELERY_BROKER_URL_COMPUTED == "redis://localhost:6379/0"
            assert settings.CELERY_RESULT_BACKEND_COMPUTED == "redis://localhost:6379/0"

    def test_environment_validation(self):
        """Test environment validation."""
        env_vars = {
            "SECRET_KEY": "a" * 32,
            "DATABASE_URL": "postgresql://user:pass@localhost:5432/db",
            "REDIS_URL": "redis://localhost:6379/0",
            "ENVIRONMENT": "invalid",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            with pytest.raises(ValidationError) as exc_info:
                Settings()
            assert "ENVIRONMENT" in str(exc_info.value)

    def test_log_level_validation(self):
        """Test log level validation."""
        env_vars = {
            "SECRET_KEY": "a" * 32,
            "DATABASE_URL": "postgresql://user:pass@localhost:5432/db",
            "REDIS_URL": "redis://localhost:6379/0",
            "LOG_LEVEL": "INVALID",
        }

        with patch.dict(os.environ, env_vars, clear=True):
            with pytest.raises(ValidationError) as exc_info:
                Settings()
            assert "LOG_LEVEL" in str(exc_info.value)