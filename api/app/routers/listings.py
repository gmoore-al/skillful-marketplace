"""HTTP endpoints for bicycle listings."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Listing
from ..schemas import Condition, ListingCreate, ListingRead

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("", response_model=list[ListingRead])
def list_listings(
    db: Session = Depends(get_db),
    q: str | None = Query(default=None, description="Free-text title substring"),
    brand: str | None = Query(default=None),
    condition: Condition | None = Query(default=None),
    location: str | None = Query(default=None),
    min_price_cents: int | None = Query(default=None, ge=0),
    max_price_cents: int | None = Query(default=None, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> list[Listing]:
    """Return listings filtered by optional query parameters.

    Results are ordered by most-recently created first.
    """
    stmt = select(Listing)
    if q:
        stmt = stmt.where(Listing.title.ilike(f"%{q}%"))
    if brand:
        stmt = stmt.where(Listing.brand.ilike(f"%{brand}%"))
    if condition is not None:
        stmt = stmt.where(Listing.condition == condition.value)
    if location:
        stmt = stmt.where(Listing.location.ilike(f"%{location}%"))
    if min_price_cents is not None:
        stmt = stmt.where(Listing.price_cents >= min_price_cents)
    if max_price_cents is not None:
        stmt = stmt.where(Listing.price_cents <= max_price_cents)
    stmt = stmt.order_by(Listing.created_at.desc()).limit(limit).offset(offset)
    return list(db.execute(stmt).scalars().all())


@router.get("/{listing_id}", response_model=ListingRead)
def get_listing(listing_id: int, db: Session = Depends(get_db)) -> Listing:
    """Return a single listing by id or raise 404 if not found."""
    listing = db.get(Listing, listing_id)
    if listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return listing


@router.post("", response_model=ListingRead, status_code=status.HTTP_201_CREATED)
def create_listing(payload: ListingCreate, db: Session = Depends(get_db)) -> Listing:
    """Create and persist a new listing, returning the stored record."""
    listing = Listing(
        title=payload.title,
        description=payload.description,
        price_cents=payload.price_cents,
        condition=payload.condition.value,
        brand=payload.brand,
        frame_size=payload.frame_size,
        location=payload.location,
        image_url=payload.image_url,
        seller_name=payload.seller_name,
        seller_email=str(payload.seller_email),
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing
