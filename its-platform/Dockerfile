# ITS Platform - Multi-stage Docker Build
# Stage 1: Builder
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=1.8.3 \
    POETRY_HOME=/opt/poetry \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry install --only=main --no-interaction --no-root

# Stage 2: Runtime
FROM python:3.11-slim AS runtime

WORKDIR /app

# Create non-root user
RUN groupadd -r itsplatform && useradd -r -g itsplatform itsplatform

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /app/.venv .venv

# Copy application code
COPY --chown=itsplatform:itsplatform src/ ./src/
COPY --chown=itsplatform:itsplatform alembic.ini ./
COPY --chown=itsplatform:itsplatform src/its_platform/db/migrations/ ./src/its_platform/db/migrations/

# Switch to non-root user
USER itsplatform

# Environment
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8000/ready', timeout=5).raise_for_status()" || exit 1

# Expose ports
EXPOSE 8000 9090

# Run application
CMD ["python", "-m", "its_platform.main"]