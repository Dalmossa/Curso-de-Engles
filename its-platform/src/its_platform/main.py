"""
ITS Platform - Main FastAPI Application.

Entry point for the Intelligent Tutoring System API.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
from structlog import get_logger

from its_platform.config import get_settings
from its_platform.db.session import close_db, init_db

settings = get_settings()
logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager."""
    logger.info("Starting ITS Platform", version=settings.APP_VERSION, environment=settings.ENVIRONMENT)

    # Initialize database
    await init_db()
    logger.info("Database initialized")

    # Verify content integrity if enabled
    if settings.CONTENT_VERIFY_ON_STARTUP:
        logger.info("Content verification enabled - run verify-integrity.py separately")

    yield

    # Cleanup
    await close_db()
    logger.info("ITS Platform shutdown complete")


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Intelligent Tutoring System for English Learning - API",
        docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
        openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
        lifespan=lifespan,
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS or ["*"],
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )

    # Prometheus metrics endpoint
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)

    # Health check endpoint
    @app.get("/health", tags=["Health"])
    async def health_check() -> dict:
        """Health check endpoint."""
        return {
            "status": "healthy",
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }

    # Readiness check (for Kubernetes)
    @app.get("/ready", tags=["Health"])
    async def readiness_check(request: Request) -> JSONResponse:
        """Readiness check - verifies DB connectivity."""
        try:
            # Quick DB ping
            from its_platform.db.session import create_session_factory
            from sqlalchemy import text

            factory = create_session_factory()
            async with factory() as session:
                await session.execute(text("SELECT 1"))
            return JSONResponse({"status": "ready", "database": "connected"})
        except Exception as e:
            logger.error("Readiness check failed", error=str(e))
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"status": "not ready", "database": "disconnected", "error": str(e)},
            )

    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception", path=request.url.path, error=str(exc))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )

    # API Routes will be registered here
    # from its_platform.api.v1 import router as api_v1_router
    # app.include_router(api_v1_router, prefix="/api/v1")

    logger.info("FastAPI application created", routes_count=len(app.routes))
    return app


app = create_app()


def run() -> None:
    """Run the application with uvicorn."""
    import uvicorn

    uvicorn.run(
        "its_platform.main:app",
        host=settings.HOST,
        port=settings.PORT,
        workers=settings.WORKERS if settings.ENVIRONMENT == "production" else 1,
        reload=settings.ENVIRONMENT == "development",
        log_level=settings.LOG_LEVEL.lower(),
    )


if __name__ == "__main__":
    run()