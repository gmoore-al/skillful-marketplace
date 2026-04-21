"""HTTP endpoints for hamster rehoming listings."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Hamster
from ..schemas import Gender, HamsterCreate, HamsterRead, Species

router = APIRouter(prefix="/hamsters", tags=["hamsters"])


@router.get("", response_model=list[HamsterRead])
def list_hamsters(
    db: Session = Depends(get_db),
    q: str | None = Query(default=None, description="Free-text name substring"),
    species: Species | None = Query(default=None),
    gender: Gender | None = Query(default=None),
    location: str | None = Query(default=None),
    max_fee_cents: int | None = Query(default=None, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> list[Hamster]:
    """Return hamsters filtered by optional query parameters.

    Results are ordered by most-recently created first.
    """
    stmt = select(Hamster)
    if q:
        stmt = stmt.where(Hamster.name.ilike(f"%{q}%"))
    if species is not None:
        stmt = stmt.where(Hamster.species == species.value)
    if gender is not None:
        stmt = stmt.where(Hamster.gender == gender.value)
    if location:
        stmt = stmt.where(Hamster.location.ilike(f"%{location}%"))
    if max_fee_cents is not None:
        stmt = stmt.where(Hamster.adoption_fee_cents <= max_fee_cents)
    stmt = stmt.order_by(Hamster.created_at.desc()).limit(limit).offset(offset)
    return list(db.execute(stmt).scalars().all())


@router.get("/{hamster_id}", response_model=HamsterRead)
def get_hamster(hamster_id: int, db: Session = Depends(get_db)) -> Hamster:
    """Return a single hamster by id or raise 404 if not found."""
    hamster = db.get(Hamster, hamster_id)
    if hamster is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hamster not found")
    return hamster


@router.post("", response_model=HamsterRead, status_code=status.HTTP_201_CREATED)
def create_hamster(payload: HamsterCreate, db: Session = Depends(get_db)) -> Hamster:
    """Create and persist a new hamster listing, returning the stored record."""
    hamster = Hamster(
        name=payload.name,
        species=payload.species.value,
        age_months=payload.age_months,
        gender=payload.gender.value,
        color=payload.color,
        temperament=payload.temperament,
        story=payload.story,
        includes=payload.includes,
        adoption_fee_cents=payload.adoption_fee_cents,
        location=payload.location,
        photo_url=payload.photo_url,
        current_human_name=payload.current_human_name,
        current_human_email=str(payload.current_human_email),
    )
    db.add(hamster)
    db.commit()
    db.refresh(hamster)
    return hamster
