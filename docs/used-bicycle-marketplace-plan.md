# Used Bicycle Marketplace — Implementation Plan

**Overall Progress:** `0%`

## TLDR

Build a mobile-first online marketplace where users can browse, list, and contact sellers of used bicycles. Scaffolded as a Next.js + TypeScript web app, a Python FastAPI service, and a local PostgreSQL database — no Docker, macOS local dev only.

## Critical Decisions

- **Stack**: Next.js (App Router) + TypeScript, Python FastAPI, PostgreSQL via Homebrew — enforced by the `tech-stack` skill.
- **Mobile-first UI**: Tailwind CSS with mobile breakpoints as the default; desktop treated as progressive enhancement.
- **No auth in v1**: Listings include a seller name + contact email captured at creation; keeps scope minimal and defers real auth to a follow-up.
- **Image handling v1**: Store image URLs (string field) rather than hosting uploads; defer object storage/upload pipeline.
- **Schema migrations**: Alembic for version-controlled schema changes.
- **Search/filter v1**: Server-side filtering by brand, condition, price range, and location substring — no full-text search engine.
- **Monorepo layout**: `web/` + `api/` at the repo root, consistent with the tech-stack skill.

## Tasks

- [ ] 🟥 **Step 1: Preflight & tooling checks**
  - [ ] 🟥 Confirm repo root is safe to scaffold into (only `README.md`, `LICENSE`, `.git/`, `.gitignore`, `.cursor/`, `images/`, `docs/`)
  - [ ] 🟥 Verify `node`, `npm`, `python3`, `pip`, `brew` are installed
  - [ ] 🟥 Update root `.gitignore` with Next.js, FastAPI, and `.venv/` entries

- [ ] 🟥 **Step 2: Local PostgreSQL (Homebrew)**
  - [ ] 🟥 Install/start `postgresql@16` via Homebrew
  - [ ] 🟥 Create `bicycles_marketplace` database and app role
  - [ ] 🟥 Document `DATABASE_URL`, `POSTGRES_DB/USER/PASSWORD` env vars

- [ ] 🟥 **Step 3: Scaffold API (`api/` — FastAPI)**
  - [ ] 🟥 Create `api/.venv` and `requirements.txt` (fastapi, uvicorn, sqlalchemy, psycopg[binary], alembic, pydantic-settings, python-dotenv)
  - [ ] 🟥 FastAPI app skeleton with health endpoint `GET /health`
  - [ ] 🟥 Settings module reading `DATABASE_URL` from env
  - [ ] 🟥 SQLAlchemy engine/session wiring
  - [ ] 🟥 Initialize Alembic and create baseline migration

- [ ] 🟥 **Step 4: Core domain — Listings**
  - [ ] 🟥 `Listing` model: id, title, description, price_cents, condition, brand, frame_size, location, image_url, seller_name, seller_email, created_at
  - [ ] 🟥 Pydantic schemas (create/read)
  - [ ] 🟥 Alembic migration for `listings` table
  - [ ] 🟥 Endpoints: `GET /listings` (with filters), `GET /listings/{id}`, `POST /listings`
  - [ ] 🟥 CORS config allowing the web app origin

- [ ] 🟥 **Step 5: Scaffold Web App (`web/` — Next.js + TS + Tailwind)**
  - [ ] 🟥 `create-next-app` with TypeScript, App Router, Tailwind, ESLint (no `src/` JS)
  - [ ] 🟥 Mobile-first base layout, viewport meta, safe-area padding, bottom nav or sticky header
  - [ ] 🟥 API client module reading `NEXT_PUBLIC_API_BASE_URL`

- [ ] 🟥 **Step 6: Marketplace UI pages**
  - [ ] 🟥 `/` Home — listing grid/feed with search + filter drawer (brand, condition, price, location)
  - [ ] 🟥 `/listings/[id]` Detail — photo, specs, description, seller contact reveal
  - [ ] 🟥 `/sell` Create listing form with client-side validation
  - [ ] 🟥 Empty/loading/error states on each page

- [ ] 🟥 **Step 7: Cursor skills for new tech**
  - [ ] 🟥 Add `.cursor/skills/nextjs/SKILL.md` (App Router + TS conventions)
  - [ ] 🟥 Add `.cursor/skills/fastapi/SKILL.md` (project layout, venv, Alembic usage)
  - [ ] 🟥 Add `.cursor/skills/tailwind-mobile-first/SKILL.md` (breakpoint defaults, touch targets)

- [ ] 🟥 **Step 8: Root README & run scripts**
  - [ ] 🟥 Document macOS setup: Postgres, venv, web install
  - [ ] 🟥 Commands: start Postgres, run migrations, run API, run web
  - [ ] 🟥 Smoke-test steps: `/health` returns 200, home page renders listings from API

- [ ] 🟥 **Step 9: Verify & close out**
  - [ ] 🟥 Seed 3–5 sample bicycle listings
  - [ ] 🟥 End-to-end smoke test on mobile viewport (Chrome devtools)
  - [ ] 🟥 Run `tech-stack` validation checklist items
