"""
Main entry point — FastAPI application with all routers registered.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import init_db, close_db
from app.core.redis_client import close_redis

from app.api.auth.register import router as register_router
from app.api.auth.login import router as login_router
from app.api.auth.logout import router as logout_router
from app.api.resume.upload_resume import router as upload_router
from app.api.resume.get_resume import router as get_resume_router
from app.api.resume.list_resumes import router as list_resumes_router
from app.api.resume.delete_resume import router as delete_resume_router
from app.api.jobs.create_job import router as create_job_router
from app.api.jobs.get_job import router as get_job_router
from app.api.jobs.update_job import router as update_job_router
from app.api.jobs.delete_job import router as delete_job_router
from app.api.jobs.list_jobs import router as list_jobs_router
from app.api.ranking.rank_candidates import router as rank_router
from app.api.ranking.get_ranking import router as get_ranking_router
from app.api.ranking.get_skill_gap import router as skill_gap_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await init_db()
    yield
    await close_db()
    await close_redis()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes
app.include_router(register_router, prefix="/auth", tags=["Auth"])
app.include_router(login_router, prefix="/auth", tags=["Auth"])
app.include_router(logout_router, prefix="/auth", tags=["Auth"])

# Resume routes
app.include_router(upload_router, prefix="/resume", tags=["Resume"])
app.include_router(get_resume_router, prefix="/resume", tags=["Resume"])
app.include_router(list_resumes_router, prefix="/resume", tags=["Resume"])
app.include_router(delete_resume_router, prefix="/resume", tags=["Resume"])

# Job routes
app.include_router(create_job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(get_job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(update_job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(delete_job_router, prefix="/jobs", tags=["Jobs"])
app.include_router(list_jobs_router, prefix="/jobs", tags=["Jobs"])

# Ranking routes
app.include_router(rank_router, prefix="/ranking", tags=["Ranking"])
app.include_router(get_ranking_router, prefix="/ranking", tags=["Ranking"])
app.include_router(skill_gap_router, prefix="/ranking", tags=["Ranking"])


@app.get("/", tags=["Health"])
async def root():
    return {"message": f"{settings.APP_NAME} is running", "version": settings.APP_VERSION}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "version": settings.APP_VERSION}
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://resume-screener-frontend-brown.vercel.app",
        "https://resume-screener-frontend-git-main-fati802s-projects.vercel.app",
        "https://resume-screener-frontend-6hnlupj7u-fati802s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)