"""Seed the database with a handful of sample bicycle listings.

Run from the API directory with the venv active:

    source .venv/bin/activate
    python scripts/seed.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal  # noqa: E402
from app.models import Listing  # noqa: E402

SAMPLES: list[dict[str, object]] = [
    {
        "title": "2019 Trek FX 3 Disc — Hybrid commuter",
        "description": "Reliable daily driver. New chain and cassette last month. Small chip on the top tube, otherwise great shape.",
        "price_cents": 45000,
        "condition": "good",
        "brand": "Trek",
        "frame_size": "M / 54cm",
        "location": "Seattle, WA",
        "image_url": "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800",
        "seller_name": "Alex",
        "seller_email": "alex@example.com",
    },
    {
        "title": "Specialized Allez road bike",
        "description": "Aluminum frame, Shimano Sora 2x9. Recently tuned up. Fits 5'8\"–6'0\".",
        "price_cents": 65000,
        "condition": "like_new",
        "brand": "Specialized",
        "frame_size": "56cm",
        "location": "Portland, OR",
        "image_url": "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800",
        "seller_name": "Priya",
        "seller_email": "priya@example.com",
    },
    {
        "title": "Cannondale Quick 4 — perfect starter",
        "description": "Great first road-adjacent bike. Some scuffs on the saddle.",
        "price_cents": 28000,
        "condition": "fair",
        "brand": "Cannondale",
        "frame_size": "S",
        "location": "Oakland, CA",
        "image_url": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800",
        "seller_name": "Jordan",
        "seller_email": "jordan@example.com",
    },
    {
        "title": "Surly Straggler gravel frameset",
        "description": "Frame + fork only. No drivetrain. Powder coated last year.",
        "price_cents": 52500,
        "condition": "good",
        "brand": "Surly",
        "frame_size": "58cm",
        "location": "Austin, TX",
        "image_url": "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800",
        "seller_name": "Sam",
        "seller_email": "sam@example.com",
    },
    {
        "title": "Kid's 20\" mountain bike",
        "description": "Outgrew it fast. Works perfectly, minor paint wear.",
        "price_cents": 12000,
        "condition": "good",
        "brand": "Giant",
        "frame_size": "20\"",
        "location": "Denver, CO",
        "image_url": "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800",
        "seller_name": "Morgan",
        "seller_email": "morgan@example.com",
    },
]


def seed() -> int:
    """Insert ``SAMPLES`` into the listings table if the table is empty.

    Returns the number of rows inserted.
    """
    with SessionLocal() as session:
        existing = session.query(Listing).count()
        if existing:
            print(f"Skipping seed: {existing} listing(s) already present.")
            return 0
        session.add_all(Listing(**sample) for sample in SAMPLES)
        session.commit()
        print(f"Inserted {len(SAMPLES)} sample listings.")
        return len(SAMPLES)


if __name__ == "__main__":
    seed()
