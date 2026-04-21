"""Pydantic schemas for request and response payloads."""

from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class Condition(str, Enum):
    """Allowed bicycle condition values."""

    NEW = "new"
    LIKE_NEW = "like_new"
    GOOD = "good"
    FAIR = "fair"
    PARTS_ONLY = "parts_only"


class ListingBase(BaseModel):
    """Fields shared between create and read schemas."""

    title: str = Field(min_length=3, max_length=140)
    description: str = Field(default="", max_length=5000)
    price_cents: int = Field(ge=0, le=10_000_000)
    condition: Condition
    brand: str = Field(default="", max_length=64)
    frame_size: str = Field(default="", max_length=32)
    location: str = Field(default="", max_length=120)
    image_url: str = Field(default="", max_length=500)


class ListingCreate(ListingBase):
    """Payload accepted by ``POST /listings``."""

    seller_name: str = Field(min_length=1, max_length=120)
    seller_email: EmailStr


class ListingRead(ListingBase):
    """Representation returned from listing endpoints."""

    id: int
    seller_name: str
    seller_email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
