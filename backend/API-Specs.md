# PNU-Pathfinder — Backend API Specifications

> **Derived from actual source code** in `backend/src/`. Update this file whenever endpoints change.
>
> **Tech reference:** [Backend-Tech.md](Backend-Tech.md) | **Architecture:** [../docs/System-Architecture.md](../docs/System-Architecture.md)
>
> Live interactive docs available at `http://localhost:8000/docs` when the server is running.

---

## Base URL

| Environment | Base URL |
|---|---|
| Local | `http://localhost:8000` |
| Staging / Production | TBD |

---

## Authentication

Two separate auth flows:

| Flow | Mechanism | Header |
|---|---|---|
| Student (regular user) | JWT Bearer token (PyJWT, issued at login/signup) | `Authorization: Bearer <token>` |
| Admin | Static token `pnu-pathfinder-admin-local-token` | `Authorization: Bearer pnu-pathfinder-admin-local-token` |

> **Security note:** The admin token is currently hardcoded. Move to an environment variable before any deployment.

---

## Endpoints

---

### Auth — `/api/auth`

#### POST `/api/auth/signup`

Register a new student account.

**Request body**
```json
{
  "name": "string",
  "student_id": "string (unique)",
  "password": "string",
  "department": "string",
  "major": "string | null",
  "career_goal": "string | null"
}
```

**Response** `201 Created`
```json
{
  "access_token": "string (JWT)",
  "user": {
    "id": 1,
    "name": "string",
    "student_id": "string",
    "department": "string",
    "major": "string | null",
    "career_goal": "string | null",
    "created_at": "ISO 8601 datetime"
  }
}
```

---

#### POST `/api/auth/login`

Authenticate an existing student.

**Request body**
```json
{
  "student_id": "string",
  "password": "string"
}
```

**Response** `200 OK` — same shape as `/signup`.

---

#### GET `/api/auth/me`

Return the currently authenticated user. Requires `Authorization: Bearer <token>`.

**Response** `200 OK`
```json
{
  "id": 1,
  "name": "string",
  "student_id": "string",
  "department": "string",
  "major": "string | null",
  "career_goal": "string | null",
  "created_at": "ISO 8601 datetime"
}
```

---

### Admin — `/api/admin`

All admin endpoints except `/api/admin/login` require `Authorization: Bearer pnu-pathfinder-admin-local-token`.

#### POST `/api/admin/login`

**Request body**
```json
{
  "admin_id": "string",
  "password": "string"
}
```

**Response** `200 OK`
```json
{
  "access_token": "string",
  "user": {
    "role": "admin",
    "name": "string",
    "admin_id": "string"
  }
}
```

---

#### POST `/api/admin/programs`

Create a new academic program with its courses and graduation requirements.

**Request body**
```json
{
  "department": "string",
  "major": "string | null",
  "curriculum_year": 2024,
  "graduation_requirement": {
    "liberal_required": 0,
    "liberal_elective": 0,
    "major_basic": 0,
    "major_required": 0,
    "major_elective": 0,
    "general_elective": 0,
    "total_credits": 0
  },
  "courses": [
    {
      "completion_category": "string",
      "course_number": "string",
      "course_name_ko": "string",
      "course_name_en": "string | null",
      "description": "string | null",
      "recommended_semester": "string",
      "credits": 3
    }
  ]
}
```

**Response** `201 Created` — `AcademicProgramRead` (see below).

**Error** `409 Conflict` — duplicate `(department, major, curriculum_year)`.

---

#### GET `/api/admin/programs`

List all academic programs, ordered by `curriculum_year DESC`, `id DESC`.

**Response** `200 OK` — array of `AcademicProgramRead`.

---

#### PUT `/api/admin/programs/{program_id}`

Replace a program's data (full replacement of courses and graduation requirements).

**Request body** — same as POST.

**Response** `200 OK` — updated `AcademicProgramRead`.

---

#### DELETE `/api/admin/programs/{program_id}`

Delete a program and all related courses/requirements (cascade).

**Response** `204 No Content`.

---

### Health — `/api/health`

#### GET `/api/health`

Liveness check. No auth required.

**Response** `200 OK`
```json
{
  "status": "ok",
  "service": "pnu-pathfinder-backend"
}
```

---

## Common Response Schemas

### `AcademicProgramRead`
```json
{
  "id": 1,
  "department": "string",
  "major": "string | null",
  "curriculum_year": 2024,
  "created_at": "ISO 8601 datetime",
  "graduation_requirement": { ... },
  "courses": [ ... ]
}
```

---

## Common Error Codes

| HTTP Code | When |
|---|---|
| 400 | Bad request / validation failure |
| 401 | Missing or invalid auth token |
| 404 | Resource not found |
| 409 | Duplicate program `(department, major, curriculum_year)` |
| 422 | Pydantic validation error (malformed body) |

---

## Planned Endpoints (RAG Phase)

These endpoints do not exist yet. They will be added when the RAG pipeline is implemented.

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/chat` | Send a question, receive a streamed RAG answer with source citations |
| `GET` | `/api/v1/chat/{session_id}/history` | Retrieve conversation history |
| `GET` | `/api/v1/documents` | List indexed knowledge-base documents |

---

## Changelog

| Date | Change | Author |
|---|---|---|
| 2026-05-02 | Rewritten from actual source code | PM |
