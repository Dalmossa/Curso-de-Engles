"""
API v1 Router - Main API version 1 router.
"""

from fastapi import APIRouter

api_v1_router = APIRouter(prefix="/api/v1")

# Placeholder for future router imports
# from its_platform.api.v1 import auth, learners, diagnostic, curriculum, adaptive, practice, listening
# api_v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# api_v1_router.include_router(learners.router, prefix="/learners", tags=["Learners"])
# api_v1_router.include_router(diagnostic.router, prefix="/diagnostic", tags=["Diagnostic"])
# api_v1_router.include_router(curriculum.router, prefix="/curriculum", tags=["Curriculum"])
# api_v1_router.include_router(adaptive.router, prefix="/adaptive", tags=["Adaptive Engine"])
# api_v1_router.include_router(practice.router, prefix="/practice", tags=["Practice"])
# api_v1_router.include_router(listening.router, prefix="/listening", tags=["Listening"])

@api_v1_router.get("/info", tags=["Info"])
async def api_info() -> dict:
    """API information endpoint."""
    return {
        "version": "v1",
        "description": "ITS Platform API v1",
        "endpoints": {
            "auth": "/api/v1/auth",
            "learners": "/api/v1/learners",
            "diagnostic": "/api/v1/diagnostic",
            "curriculum": "/api/v1/curriculum",
            "adaptive": "/api/v1/adaptive",
            "practice": "/api/v1/practice",
            "listening": "/api/v1/listening",
        },
    }