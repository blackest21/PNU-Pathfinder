# PNU-Pathfinder — Technology Stack & Skills Matrix

> **Purpose:** This is the single source of truth for all technology choices, derived from the actual source code. Every team member must use the exact versions listed here. No library or framework may be added without updating this document first via a reviewed PR.

---

## 1. Skills Matrix (Current Implementation)

### Backend

| Technology | Version (pinned) | File Reference |
|---|---|---|
| **Language** | Python 3.11.x (`pyenv` recommended) | — |
| **API Framework** | FastAPI `0.136.1` | `backend/requirements.txt` |
| **ASGI Server** | uvicorn[standard] `0.46.0` | `backend/requirements.txt` |
| **ORM** | SQLAlchemy `2.0.49` (synchronous) | `backend/src/models.py` |
| **DB Driver** | psycopg[binary] `3.3.3` (sync) | `backend/requirements.txt` |
| **Database** | PostgreSQL 16.x | `backend/migrations/` |
| **Auth** | PyJWT `2.12.1` + passlib[bcrypt] `1.7.4` | `backend/src/auth/` |
| **Password Hashing** | bcrypt `4.3.0` | `backend/requirements.txt` |
| **Config** | python-dotenv `1.2.2` | `backend/.env.example` |
| **OpenAI SDK** | openai `2.33.0` | `backend/requirements.txt` |
| **API Docs** | FastAPI OpenAPI / Swagger UI | `http://localhost:8000/docs` |

> **Note:** The ORM is synchronous (standard `Session`, not `AsyncSession`). Do not introduce async SQLAlchemy without a team decision and updating this table.

### Frontend

| Technology | Version (pinned) | File Reference |
|---|---|---|
| **Language** | TypeScript `^6.0.3` | `frontend/package.json` |
| **UI Framework** | React `^19.0.0` | `frontend/package.json` |
| **Build Tool** | Vite `^7.0.0` | `frontend/vite.config.ts` |
| **React Plugin** | @vitejs/plugin-react `^5.0.0` | `frontend/package.json` |
| **Icon Library** | lucide-react `^0.468.0` | `frontend/package.json` |
| **Fonts** | Noto Sans KR, Space Mono (Google Fonts) | `frontend/src/styles.css` |

> **Note:** There is **no** CSS framework (e.g., Tailwind) — styling uses Tailwind utility classes via inline `className` + a small `styles.css` for custom animations. There is **no** client-side router — page navigation is managed via `useState` in `App.tsx`.

---

## 2. What Is NOT Used (Common Assumptions to Avoid)

| Often assumed | Actual status |
|---|---|
| Next.js | Not used — plain React + Vite |
| Tailwind CSS package | Not installed — utility-style classNames only |
| shadcn/ui | Not used |
| React Router / Next navigation | Not used — `useState` routing in `App.tsx` |
| React Query / SWR | Not used — raw `fetch` in service files |
| Zustand / Redux | Not used — `localStorage` + React state |
| LangChain / RAG pipeline | Not yet implemented (planned after structured backend APIs) |
| Qdrant / vector DB | Not yet implemented; pgvector vs Qdrant not finalized |
| Alembic (migrations) | Not used — raw SQL files in `backend/migrations/` |
| Docker Compose | Not yet added |
| Async SQLAlchemy | Not used — sync ORM |
| Spring Boot / JPA / QueryDSL | Not used — current backend is FastAPI + SQLAlchemy |

---

## 3. Linting & Formatting (To Be Configured)

### Backend (Python)
| Tool | Status | Target Config |
|---|---|---|
| `ruff` | Not yet added | `ruff.toml`, line length 100 |
| `mypy` | Not yet added | `mypy.ini`, strict mode |
| `pre-commit` | Not yet added | `.pre-commit-config.yaml` |

### Frontend (TypeScript)
| Tool | Status | Target Config |
|---|---|---|
| ESLint | Not yet added | `.eslintrc.json` |
| Prettier | Not yet added | `.prettierrc` |

> Add these tools before the first collaborative sprint to prevent style conflicts.

---

## 4. Environment Variables

```bash
# backend/.env  (copy from backend/.env.example)
DATABASE_URL=postgresql+psycopg:///pnu_pathfinder
JWT_SECRET=pnu-pathfinder-local-dev-secret
ADMIN_ID=root
ADMIN_PASSWORD=3011
ADMIN_TOKEN=pnu-pathfinder-admin-local-token
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

> Development defaults exist in code for local convenience. Production deployments must provide strong values through environment variables.

---

## 5. Database Migrations

No migration framework (e.g., Alembic) is in use. Apply schema changes by running:

```bash
psql -d pnu_pathfinder -f backend/migrations/<filename>.sql
```

Files are numbered sequentially: `001_initial_schema.sql`, `002_course_records.sql`, etc.

---

## 6. Cross-Team Integration Points

| Contract | Owner | Reference |
|---|---|---|
| REST API endpoints | Backend | [backend/API-Specs.md](backend/API-Specs.md) |
| DB schema | Backend | `backend/migrations/` |
| Frontend service layer | Frontend | `frontend/src/services/` |
| Backend design/status | Backend | [backend/README.md](backend/README.md) |
| Overall progress | PM / Integration | [PROGRESS.md](PROGRESS.md) |

> The FastAPI OpenAPI schema is auto-generated at `GET /docs` (Swagger UI) and `GET /openapi.json`. Frontend service files must stay in sync with backend endpoint changes.
