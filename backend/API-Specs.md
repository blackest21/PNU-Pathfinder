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
  "career_goal": "string | null",
  "privacy_consent": true
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
    "career_goal": "string | null"
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
  "career_goal": "string | null"
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

#### POST `/api/admin/crawl/run`

Manually apply already-collected crawler/ingestion data. Structured academic programs are upserted into PostgreSQL, and document text is chunked into `document_chunks`.

**Request body**
```json
{
  "programs": [
    {
      "department": "string",
      "major": "string | null",
      "curriculum_year": 2024,
      "graduation_requirement": {
        "liberal_required": 10,
        "liberal_elective": 15,
        "major_basic": 25,
        "major_required": 36,
        "major_elective": 41,
        "general_elective": 6,
        "total_credits": 133
      },
      "courses": []
    }
  ],
  "documents": [
    {
      "source_url": "https://example.ac.kr/notice/1",
      "title": "string",
      "category": "notice",
      "content": "plain text extracted from HTML/PDF"
    }
  ]
}
```

**Response** `200 OK`
```json
{
  "programs_created": 0,
  "programs_updated": 1,
  "documents_created": 1,
  "documents_updated": 0,
  "documents_unchanged": 0,
  "chunks_written": 3
}
```

---

### Course Records — `/api/courses`

All course record endpoints require student authentication with `Authorization: Bearer <token>`.

#### POST `/api/courses`

Add a course record for the current student.

**Request body**
```json
{
  "course_number": "string",
  "course_name": "string",
  "completion_category": "string",
  "credits": 3,
  "grade": "A+ | A0 | B+ | ... | null",
  "semester": "2024-1",
  "is_retake": false
}
```

**Response** `201 Created`
```json
{
  "id": 1,
  "course_number": "string",
  "course_name": "string",
  "completion_category": "string",
  "credits": 3,
  "grade": "string | null",
  "semester": "string",
  "is_retake": false,
  "created_at": "ISO 8601 datetime"
}
```

**Error** `409 Conflict` — duplicate `(user_id, course_number, semester)`.

---

#### GET `/api/courses/me`

Return all course records for the current student.

**Response** `200 OK` — array of course record objects.

---

#### DELETE `/api/courses/{record_id}`

Delete one course record owned by the current student.

**Response** `204 No Content`.

---

### Graduation — `/api/graduation`

All graduation endpoints require student authentication with `Authorization: Bearer <token>`.

#### GET `/api/graduation/progress`

Calculate graduation progress for the current student using their department/major and saved course records.

**Response** `200 OK`
```json
{
  "program_id": 1,
  "department": "string",
  "major": "string | null",
  "curriculum_year": 2024,
  "categories": {
    "liberal_required": {
      "required": 10,
      "earned": 6,
      "remaining": 4,
      "percent": 60.0
    }
  },
  "total": {
    "required": 133,
    "earned": 42,
    "remaining": 91,
    "percent": 31.6
  },
  "completed_course_numbers": ["AB2001051"]
}
```

**Error** `404 Not Found` — no matching academic program or graduation requirement.

---

#### GET `/api/graduation/recommend`

Return recommended next courses and retake candidates for the current student.

**Response** `200 OK`
```json
{
  "program_id": 1,
  "next_courses": [
    {
      "id": 1,
      "course_number": "AB2001051",
      "course_name_ko": "인공지능",
      "course_name_en": "ARTIFICIAL INTELLIGENCE",
      "completion_category": "전공선택",
      "recommended_semester": "3-1",
      "credits": 3,
      "reason": "아직 충족하지 못한 졸업요건 영역의 과목입니다."
    }
  ],
  "retake_courses": []
}
```

---

### Chat — `/api/chat`

The current prototype returns a JSON answer using student profile, course records, graduation progress, and recommendations. If `OPENAI_API_KEY` is set, it calls OpenAI; otherwise it falls back to a local rule-based response.

#### POST `/api/chat`

**Request body**
```json
{
  "message": "다음 학기에 뭘 들으면 좋을까?"
}
```

**Response** `200 OK`
```json
{
  "answer": "학생의 현재 졸업요건 진행률과 추천 과목을 바탕으로 생성된 응답",
  "used_sources": ["student_profile", "course_records", "graduation_requirements"],
  "mode": "openai | local"
}
```

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
| 409 | Duplicate program or duplicate course record |
| 422 | Pydantic validation error (malformed body) |

---

## Planned Endpoints (RAG Phase)

These endpoints do not exist yet. They will be added when the RAG pipeline is implemented.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/chat/{session_id}/history` | Retrieve conversation history |
| `GET` | `/api/documents` | List indexed knowledge-base documents |

---

## Changelog

| Date | Change | Author |
|---|---|---|
| 2026-05-03 | Added optional OpenAI chat response with local fallback | Codex |
| 2026-05-03 | Added admin crawl ingestion endpoint and document chunk tables | Codex |
| 2026-05-03 | Added course records and graduation APIs | Codex |
| 2026-05-02 | Rewritten from actual source code | PM |
