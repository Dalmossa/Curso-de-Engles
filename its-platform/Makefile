# ITS Platform - Makefile for Development Tasks
# Usage: make <target>

.PHONY: help install dev test lint format type-check db-migrate db-upgrade db-downgrade db-revision content-sync content-verify run run-dev docker-build docker-run clean

# Default target
help:
	@echo "ITS Platform - Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  install          Install dependencies with Poetry"
	@echo "  dev              Set up development environment"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint             Run ruff linter"
	@echo "  format           Format code with black"
	@echo "  type-check       Run mypy type checker"
	@echo "  check-all        Run lint, format check, and type-check"
	@echo ""
	@echo "Testing:"
	@echo "  test             Run all tests (unit + integration)"
	@echo "  test-unit        Run unit tests only"
	@echo "  test-integration Run integration tests only"
	@echo "  test-bdd         Run BDD tests"
	@echo "  test-mutation    Run mutation tests"
	@echo "  coverage         Generate coverage report"
	@echo ""
	@echo "Database:"
	@echo "  db-migrate       Create new migration (usage: make db-migrate MSG='message')"
	@echo "  db-upgrade       Apply migrations to latest"
	@echo "  db-downgrade     Downgrade one migration"
	@echo "  db-revision      Show current revision"
	@echo "  db-history       Show migration history"
	@echo ""
	@echo "Content:"
	@echo "  content-sync     Sync content from repository to database"
	@echo "  content-verify   Run content integrity verification"
	@echo ""
	@echo "Run:"
	@echo "  run              Run production server"
	@echo "  run-dev          Run development server with reload"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build     Build Docker image"
	@echo "  docker-run       Run Docker container"
	@echo ""
	@echo "Utilities:"
	@echo "  clean            Clean build artifacts"
	@echo "  security-scan    Run security scans (bandit, trivy)"

# Setup
install:
	cd its-platform && poetry install --no-interaction --with dev,test

dev: install
	cp -n its-platform/.env.example its-platform/.env || true
	@echo "Development environment ready. Edit its-platform/.env with your settings."

# Code Quality
lint:
	cd its-platform && poetry run ruff check src/ tests/

format:
	cd its-platform && poetry run black src/ tests/

format-check:
	cd its-platform && poetry run black --check src/ tests/

type-check:
	cd its-platform && poetry run mypy --strict src/

check-all: lint format-check type-check

# Testing
test: test-unit test-integration

test-unit:
	cd its-platform && poetry run pytest tests/unit -v --cov=its_platform --cov-report=term-missing --cov-fail-under=95

test-integration:
	cd its-platform && poetry run pytest tests/integration -v --cov=its_platform --cov-append --cov-report=term-missing --cov-fail-under=80

test-bdd:
	cd its-platform && poetry run pytest tests/bdd -v

test-mutation:
	cd its-platform && poetry run mutmut run --paths-to-mutate=its_platform/adaptive --runner="pytest tests/unit/adaptive -x"
	cd its-platform && poetry run mutmut results --threshold=85

coverage:
	cd its-platform && poetry run pytest --cov=its_platform --cov-report=html --cov-report=term

# Database
db-migrate:
	cd its-platform && poetry run alembic revision --autogenerate -m "$(MSG)"

db-upgrade:
	cd its-platform && poetry run alembic upgrade head

db-downgrade:
	cd its-platform && poetry run alembic downgrade -1

db-revision:
	cd its-platform && poetry run alembic current

db-history:
	cd its-platform && poetry run alembic history --verbose

# Content
content-sync:
	cd its-platform && poetry run python -c "
from its_platform.content.loader import ContentLoader
from its_platform.content.service import ContentService
from its_platform.db.session import create_session_factory
import asyncio

async def main():
    factory = create_session_factory()
    async with factory() as session:
        service = ContentService(session)
        result = await service.sync_all()
        print(f'Lessons: {result[\"lessons\"]}')
        print(f'Packs: {result[\"packs\"]}')

asyncio.run(main())
"

content-verify:
	python3 verify-integrity.py
	python3 prd-score.py

# Run
run:
	cd its-platform && poetry run python -m its_platform.main

run-dev:
	cd its-platform && poetry run uvicorn its_platform.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug

# Docker
docker-build:
	docker build -t its-platform:latest its-platform/

docker-run:
	docker run -p 8000:8000 --env-file its-platform/.env its-platform:latest

# Security
security-scan:
	cd its-platform && poetry run bandit -r src/ -f json -o bandit-results.json || true
	docker run --rm -v $(PWD):/workspace aquasec/trivy:latest fs --format sarif --output trivy-results.sarif its-platform/

# Clean
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	rm -f its-platform/bandit-results.json its-platform/trivy-results.sarif its-platform/coverage.xml 2>/dev/null || true
	@echo "Cleaned build artifacts"