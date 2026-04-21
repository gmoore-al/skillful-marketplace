# Skillful Marketplace

This repo is a starter pack for a non-engineer who wants to use Cursor to build a full-stack application, e.g. a marketplace app.

## Getting Started

![Fork this repo](images/fork-me.png)

0. Install git & install Cursor

1. Fork this repo (↗️) to your own GitHub

2. From your own repo, copy the Clone URL (↗️)

3. Open a terminal (on Mac: Cmd + Space and type 'Terminal') and run:
```bash
mkdir ~/Dev
cd ~/Dev
git clone <url>
```

4. Open Cursor and open the repo (File → Open Folder)

5. Try out your first cursor command! In the chat type "/" then start to type the word t.e.a.c.h, press enter to get the command `teach-me`, then ask any question that comes to mind. Example:
    - `/teach-me what are the cursor commands in this repo?`

6. Build! Example:
    - `/plan I want to build a beautiful marketplace to sell my <really cool t-shirts|hamsters|artwork|surf boards|shoes and/or AI data infrastructure>`

---

## Running Hamstr

This repo currently contains **Hamstr**, a gentle, story-driven marketplace for rehoming hamsters.

- `web/` — Next.js App Router + TypeScript + Tailwind
- `api/` — Python FastAPI + SQLAlchemy + Alembic
- PostgreSQL running locally via Homebrew (no Docker)

### 1. One-time setup (macOS)

```bash
# Toolchain
brew install python@3.12 node postgresql@16
brew services start postgresql@16

# Database + app role
psql postgres <<'SQL'
CREATE ROLE hamstr_app WITH LOGIN PASSWORD 'hamstr_app';
CREATE DATABASE hamstr_marketplace OWNER hamstr_app;
GRANT ALL PRIVILEGES ON DATABASE hamstr_marketplace TO hamstr_app;
SQL

# API: venv + deps + migrations + sample data
cd api
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python scripts/seed.py
deactivate
cd ..

# Web: deps
cd web
npm install
cp .env.example .env.local 2>/dev/null || true
cd ..
```

> **Migrating from the old `bicycles_marketplace` DB?** Drop it with
> `dropdb bicycles_marketplace && dropuser bicycles_app` (or skip — it
> just sits unused) before running the `psql` block above.

### 2. Run locally (two terminals)

Terminal 1 — API (http://127.0.0.1:8000):

```bash
cd api
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2 — Web (http://localhost:3000):

```bash
cd web
npm run dev
```

### 3. Smoke test

```bash
curl http://127.0.0.1:8000/health             # -> {"status":"ok"}
curl http://127.0.0.1:8000/hamsters | head    # -> JSON array of hamsters
open http://localhost:3000                    # home page should render the seeded hamsters
```

### Environment variables

Both apps read config from `.env` files (already committed as `.env.example`):

| File | Purpose |
| --- | --- |
| `api/.env` | `DATABASE_URL`, `POSTGRES_*`, `CORS_ALLOW_ORIGINS`, `API_HOST`, `API_PORT` |
| `web/.env.local` | `NEXT_PUBLIC_API_BASE_URL` (default `http://127.0.0.1:8000`) |
