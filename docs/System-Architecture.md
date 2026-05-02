# PNU-Pathfinder — System Architecture

> Reflects the **current implementation**. The RAG pipeline section describes the planned next phase.

---

## 1. Current Architecture (Phase 1 — Auth + Academic Data)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Browser)                           │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP
┌──────────────────────────────▼──────────────────────────────────┐
│              React 19 + Vite Frontend  (port 5173)              │
│                                                                 │
│  Pages: AuthPage · ChatPage · DataPage · AdminPages             │
│  State: localStorage (JWT token + user) + React useState        │
│  Services: authApi.ts · adminApi.ts  →  fetch()                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST  (CORS: localhost:5173)
┌──────────────────────────────▼──────────────────────────────────┐
│              FastAPI Backend  (port 8000)                       │
│                                                                 │
│  /api/auth/*     JWT-based student auth (PyJWT + bcrypt)        │
│  /api/admin/*    Static-token admin CRUD                        │
│  /api/health     Liveness check                                 │
│                                                                 │
│  ORM: SQLAlchemy 2.0 (sync)  ·  Driver: psycopg v3 (sync)      │
└──────────────────────────────┬──────────────────────────────────┘
                               │ SQL
┌──────────────────────────────▼──────────────────────────────────┐
│                  PostgreSQL  (local / TBD port)                 │
│                                                                 │
│  users · academic_programs · curriculum_courses                 │
│  graduation_requirements                                        │
│                                                                 │
│  Migrations: raw SQL files in backend/migrations/               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema

```
users
  id · name · student_id (unique) · password_hash
  department · major · career_goal · created_at

academic_programs
  id · department · major · curriculum_year
  UNIQUE(department, major, curriculum_year)
  → has many: curriculum_courses
  → has one:  graduation_requirements

curriculum_courses
  id · program_id (FK) · completion_category · course_number
  course_name_ko · course_name_en · description
  recommended_semester · credits · created_at

graduation_requirements
  id · program_id (FK, unique) · liberal_required · liberal_elective
  major_basic · major_required · major_elective
  general_elective · total_credits · created_at
```

---

## 3. Auth Flow

```
Student:
  POST /api/auth/signup or /login
  → server returns { access_token (JWT), user }
  → frontend stores in localStorage
  → subsequent requests: Authorization: Bearer <JWT>
  → GET /api/auth/me decodes token → returns user

Admin:
  POST /api/admin/login (admin_id=root, password=3011)
  → returns static token "pnu-pathfinder-admin-local-token"
  → all /api/admin/* routes validate this token
```

---

## 4. Planned Architecture — Phase 2 (RAG Pipeline)

```
┌──────────────────────────────────────────────────────────────────┐
│                          USER (Browser)                          │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│              React Frontend  (existing + new chat features)      │
│              Source citations panel · Document explorer          │
└──────────────────────────────┬───────────────────────────────────┘
                               │ REST / SSE
┌──────────────────────────────▼───────────────────────────────────┐
│              FastAPI Backend  (existing + new RAG endpoints)     │
│  POST /api/v1/chat   →  RAG pipeline                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  1. Embed user query  (OpenAI text-embedding-3-small)      │  │
│  │  2. Retrieve top-5 chunks from Qdrant                      │  │
│  │  3. Build prompt: system + context + history + query       │  │
│  │  4. Stream LLM response (GPT-4o or Claude)                 │  │
│  │  5. Return citations alongside streamed tokens             │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────┬───────────────┬────────────────────┬──────────────────────┘
       │               │                    │
┌──────▼─────┐  ┌──────▼──────┐  ┌──────────▼──────────┐
│  Qdrant    │  │  LLM API    │  │   PostgreSQL         │
│  Vector DB │  │  (external) │  │  + conversation log  │
└────────────┘  └─────────────┘  └─────────────────────┘
       ▲
       │  Ingest pipeline (offline)
┌──────┴──────────────────────────────────────────────┐
│  Document Ingestion                                  │
│  PNU portal scraper → chunker → embedder → upsert  │
└──────────────────────────────────────────────────────┘
```

---

## 5. Deployment (Target)

| Service | Target |
|---|---|
| Frontend | Vercel or static hosting |
| Backend | Docker on VPS |
| PostgreSQL | Managed DB or Docker |
| Qdrant | Docker or Qdrant Cloud (Phase 2) |

Docker Compose has not been added yet. It should be added before the first deployment.

---

## 6. Security Notes

| Issue | Severity | Status |
|---|---|---|
| Admin credentials hardcoded in `admin/router.py` | **High** | Must move to `.env` before deploy |
| JWT secret hardcoded (verify in `auth/service.py`) | **High** | Must move to `.env` before deploy |
| No rate limiting on any endpoint | Medium | Add before public release |
| Admin token is a static string | Medium | Replace with proper admin JWT before deploy |
