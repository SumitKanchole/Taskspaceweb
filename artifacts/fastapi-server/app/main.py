from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.cache import init_redis, close_redis

from app.db.database import engine
from sqlalchemy import text
import logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Redis
    await init_redis()
    
    try:
        from app.models import Base
        from sqlalchemy import text
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print("DB init error:", e)
    
    yield
    # Shutdown: Disconnect from Redis safely
    await close_redis()

from fastapi.routing import APIRoute

def custom_generate_unique_id(route: APIRoute):
    return route.name

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
    generate_unique_id_function=custom_generate_unique_id
)

# ---------------------------------------------------------------------------
# CORS — Permanent, robust configuration
# ---------------------------------------------------------------------------
# Why regex instead of a list:
#   - Netlify generates unique preview URLs per deploy (e.g. abc123--taskspaceweb.netlify.app)
#   - A static list would break every single preview deploy
#   - allow_origin_regex matches ALL subdomains in one pattern, forever
#
# Pattern covers:
#   *.netlify.app           -> all Netlify preview & production URLs
#   localhost (any port)    -> local development
#   127.0.0.1 (any port)   -> alternate local dev address
# ---------------------------------------------------------------------------
import os

ALLOWED_ORIGIN_REGEX = (
    r"https?://(localhost|127\.0\.0\.1)(:\d+)?"   # local dev, any port
    r"|https://[a-zA-Z0-9\-]+\.netlify\.app"       # ALL netlify subdomains
)

# Additional explicit origins from env (custom domains, etc.)
_extra_origins: list[str] = []
for env_key in ("FRONTEND_URL", "NETLIFY_URL"):
    val = os.getenv(env_key)
    if val and val not in _extra_origins:
        _extra_origins.append(val.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_extra_origins,            # explicit extras (optional safety net)
    allow_origin_regex=ALLOWED_ORIGIN_REGEX, # covers ALL deploy previews + localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.api_router import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "TaskSpace API — Online"}

@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {"status": "ok"}
