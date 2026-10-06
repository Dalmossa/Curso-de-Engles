# ITS Platform - Makefile for Development Tasks
# Usage: make <target>

.PHONY: help install dev test lint format type-check db-migrate db-upgrade db-downgrade db-revision content-sync content-verify release-check release-gates-report run run-dev docker-build docker-run clean

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
	@echo "  release-check    CONSTITUTION.md §6.3 release gates (blocking; fails until MVP lands)"
	@echo "  release-gates-report  Same report, non-blocking"
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
	poetry install --no-interaction --with dev,test

dev: install
	cp -n .env.example .env || true
	@echo "Development environment ready. Edit .env with your settings."

# Code Quality
lint:
	poetry run ruff check src/ tests/

format:
	poetry run black src/ tests/

format-check:
	poetry run black --check src/ tests/

type-check:
	poetry run mypy --strict src/

check-all: lint format-check type-check

# Testing
test: test-unit test-integration

test-unit:
	poetry run pytest tests/unit -v --cov=its_platform --cov-report=term-missing --cov-fail-under=95

test-integration:
	poetry run pytest tests/integration -v --cov=its_platform --cov-append --cov-report=term-missing --cov-fail-under=80

test-bdd:
	poetry run pytest tests/bdd -v

# CONSTITUTION.md §4.8 sets >= 85%. The target `its_platform/adaptive` does not exist — the
# adaptive engine is BACKLOG.md P1.3/P1.4 and has never been written — so this target failed
# on invocation. It now refuses with the reason instead of a "file not found" from mutmut, and
# the CI `mutation-test` job carries the same assertion (ADR-012 supersedes this Python tree
# with NestJS, so re-point both at src/domain/ after P0.3).
test-mutation:
	@if [ ! -d src/its_platform/adaptive ]; then \
	  echo "[FAIL] CONSTITUTION.md §4.8 mutation gate: target src/its_platform/adaptive/ absent"; \
	  echo "       The adaptive engine is BACKLOG.md P1.3/P1.4 and has not been written."; \
	  echo "       ADR-012 supersedes this tree with NestJS; re-point at src/domain/ after P0.3."; \
	  exit 1; \
	fi
	poetry run mutmut run --paths-to-mutate=its_platform/adaptive --runner="pytest tests/unit/adaptive -x"
	poetry run mutmut results --threshold=85

coverage:
	poetry run pytest --cov=its_platform --cov-report=html --cov-report=term

# Database
db-migrate:
	poetry run alembic revision --autogenerate -m "$(MSG)"

db-upgrade:
	poetry run alembic upgrade head

db-downgrade:
	poetry run alembic downgrade -1

db-revision:
	poetry run alembic current

db-history:
	poetry run alembic history --verbose

# Content
content-sync:
	poetry run python - <<-'PY'
	from its_platform.content.loader import ContentLoader
	from its_platform.content.service import ContentService
	from its_platform.db.session import create_session_factory
	import asyncio

	async def main():
	    factory = create_session_factory()
	    async with factory() as session:
	        service = ContentService(session)
	        result = await service.sync_all()
	        print(f"Lessons: {result['lessons']}")
	        print(f"Packs: {result['packs']}")

	asyncio.run(main())
	PY

content-verify:
	python3 ../verify-integrity.py
	python3 ../prd-score.py
	python3 scripts/verify-release-gates.py || true

# CONSTITUTION.md §6.3 — the seven release gates.
#
# Deliberately NOT folded into `content-verify`: that target is about the *content repository*
# and runs in CI on every push, whereas these gates ask whether the *platform* is releasable.
# Mixing them would make an expected FAIL (there are 13 today) indistinguishable from content
# corruption. Run `make release-check` and read the gate report.
#
# `|| true` here is intentional and is the opposite of the bandit defect fixed on 2026-10-05:
# this script reports a *fact* about readiness and is expected to exit 1 until the work lands.
# It is wired into CI as a reporting step (non-blocking, `continue-on-error: true`) so the
# gate list is visible on every run, and it is wired into `release-check` below as blocking so
# that a release cannot be cut while it fails.
release-check:
	@echo "CONSTITUTION.md §6.3 — release gates (expected to FAIL until the MVP lands)"
	@python3 scripts/verify-release-gates.py --verbose; \
	  status=$$?; \
	  echo; \
	  if [ $$status -eq 0 ]; then \
	    echo "All seven gates pass. The release checklist in CONSTITUTION.md §6.2 may start."; \
	  else \
	    echo "Release blocked. This target is blocking by design: see the gate report above."; \
	  fi; \
	  exit $$status

release-gates-report:
	@python3 scripts/verify-release-gates.py --verbose || true

# Run
run:
	poetry run python -m its_platform.main

run-dev:
	poetry run uvicorn its_platform.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug

# Docker
docker-build:
	docker build -t its-platform:latest .

docker-run:
	docker run -p 8000:8000 --env-file .env its-platform:latest

# Security
#
# `|| true` was removed from bandit on 2026-10-05. It was the same defect as the CI one:
# a scanner that swallows its own exit status reports nothing. The threshold lives in
# scripts/bandit-gate.py so it cannot drift from the CI step's threshold — a security
# threshold duplicated across two files is one nobody re-reads.
#
# The scanner itself still runs non-fatally so that a finding produces a report either way;
# it is the gate decision that is blocking, not the report.
security-scan:
	(poetry run bandit -r src/ -f json -o bandit-results.json || true)
	python3 scripts/bandit-gate.py bandit-results.json
	docker run --rm -v $(PWD):/workspace aquasec/trivy:latest fs --format sarif --output trivy-results.sarif .

# Clean
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	rm -f bandit-results.json bandit-results.sarif trivy-results.sarif coverage.xml 2>/dev/null || true
	@echo "Cleaned build artifacts"