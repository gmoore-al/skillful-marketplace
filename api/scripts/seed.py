"""Seed the database with a handful of sample hamster listings.

Run from the API directory with the venv active::

    source .venv/bin/activate
    python scripts/seed.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal  # noqa: E402
from app.models import Hamster  # noqa: E402

SAMPLES: list[dict[str, object]] = [
    {
        "name": "Beatrice",
        "species": "syrian",
        "age_months": 14,
        "gender": "female",
        "color": "Golden",
        "temperament": "Curious, gentle, surprisingly opinionated about millet.",
        "story": (
            "Beatrice is the reason Hamstr exists. She arrived in our backyard in a "
            "cardboard carrier with a note. She's the queen of slow blinks and likes "
            "to be hand-fed sunflower seeds before her evening run. Looking for a "
            "calm home with patient humans."
        ),
        "includes": "Bin cage (75L), 8\" silent wheel, hideout, food + bedding for a month.",
        "adoption_fee_cents": 0,
        "location": "Ottawa, ON",
        "photo_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800",
        "current_human_name": "Greg",
        "current_human_email": "greg@example.com",
    },
    {
        "name": "Mochi",
        "species": "roborovski",
        "age_months": 6,
        "gender": "male",
        "color": "Sandy with a white belly",
        "temperament": "Zoomies. Constant zoomies.",
        "story": (
            "Mochi is a tiny brown blur. He's not a cuddler, but he's mesmerizing to "
            "watch. Best for an experienced human who wants a hamster to admire from "
            "just outside the glass."
        ),
        "includes": "20-gallon tank, 6\" wheel, sand bath, deep substrate.",
        "adoption_fee_cents": 1500,
        "location": "Toronto, ON",
        "photo_url": "https://images.unsplash.com/photo-1591561582301-7ce6588cc286?w=800",
        "current_human_name": "Priya",
        "current_human_email": "priya@example.com",
    },
    {
        "name": "Pickle",
        "species": "dwarf_winter_white",
        "age_months": 9,
        "gender": "female",
        "color": "Pearl",
        "temperament": "Shy at first, then a total snack thief.",
        "story": (
            "Pickle would rather you didn't make eye contact for the first week. After "
            "that, she will absolutely climb into your sleeve to find pumpkin seeds. "
            "Looking for a quiet home with someone who reads a lot."
        ),
        "includes": "Glass tank, mesh lid, wheel, all the bedding.",
        "adoption_fee_cents": 0,
        "location": "Montreal, QC",
        "photo_url": "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800",
        "current_human_name": "Jordan",
        "current_human_email": "jordan@example.com",
    },
    {
        "name": "Captain Whiskers",
        "species": "syrian",
        "age_months": 4,
        "gender": "male",
        "color": "Banded black and white",
        "temperament": "Bold, friendly, slightly dramatic.",
        "story": (
            "Captain has a flair for theater. He'll tip his food bowl if dinner is late. "
            "Loves cardboard tubes more than any toy we've bought him. Great first "
            "hamster for a kid who's done the reading."
        ),
        "includes": "Cage, wheel, six cardboard tubes (the good kind).",
        "adoption_fee_cents": 2000,
        "location": "Vancouver, BC",
        "photo_url": "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800",
        "current_human_name": "Sam",
        "current_human_email": "sam@example.com",
    },
    {
        "name": "Tofu",
        "species": "chinese",
        "age_months": 11,
        "gender": "male",
        "color": "Brown with a dorsal stripe",
        "temperament": "Climber. He'd live in the curtains if we let him.",
        "story": (
            "Tofu is athletic and tail-prehensile (yes, really). Needs vertical space "
            "and lots of branches. We're moving overseas and can't take him with us."
        ),
        "includes": "Tall mesh enclosure, branches, hammock, food supply.",
        "adoption_fee_cents": 1000,
        "location": "Halifax, NS",
        "photo_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800",
        "current_human_name": "Morgan",
        "current_human_email": "morgan@example.com",
    },
    {
        "name": "Pip",
        "species": "dwarf_campbell",
        "age_months": 7,
        "gender": "female",
        "color": "Argente",
        "temperament": "Cuddly once she trusts you. Trust takes about a week.",
        "story": (
            "Pip is a little softie. She fell asleep in my hoodie pocket twice this "
            "month. Rehoming because of a new family allergy."
        ),
        "includes": "Bin cage, wheel, two hideouts, bedding.",
        "adoption_fee_cents": 0,
        "location": "Calgary, AB",
        "photo_url": "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800",
        "current_human_name": "Alex",
        "current_human_email": "alex@example.com",
    },
]


def seed() -> int:
    """Insert ``SAMPLES`` into the hamsters table if the table is empty.

    Returns the number of rows inserted.
    """
    with SessionLocal() as session:
        existing = session.query(Hamster).count()
        if existing:
            print(f"Skipping seed: {existing} hamster(s) already present.")
            return 0
        session.add_all(Hamster(**sample) for sample in SAMPLES)
        session.commit()
        print(f"Inserted {len(SAMPLES)} sample hamsters.")
        return len(SAMPLES)


if __name__ == "__main__":
    seed()
