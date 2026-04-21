"""FastAPI application entrypoint for the bicycles marketplace."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import listings

settings = get_settings()

app = FastAPI(
    title="Skillful Bicycles Marketplace API",
    version="0.1.0",
    description="Used bicycle marketplace service.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(listings.router)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    """Liveness probe used by deployment targets and smoke tests."""
    return {"status": "ok"}
