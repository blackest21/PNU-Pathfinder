# PNU Pathfinder Backend

PNU Pathfinder의 백엔드는 학생의 수강 이력, 졸업요건 계산, 과목 추천, AI 상담 기능을 제공하는 API 서버입니다. 현재 목표는 운영급 완성보다 발표/프로토타입에 필요한 핵심 흐름을 간이로 완성하는 것입니다.

---

## 1. 기술 선택

현재 백엔드는 `FastAPI + SQLAlchemy + PostgreSQL` 기반입니다.

Spring Boot가 나쁜 선택이라서 제외한 것은 아닙니다. 장기 운영 서비스, 대규모 도메인, 복잡한 트랜잭션, Java/Spring에 익숙한 팀이라면 Spring Boot도 좋은 선택입니다.

이 프로젝트에서는 아래 이유로 FastAPI가 더 적합합니다.

- AI/RAG 연동에 필요한 OpenAI SDK, LangChain, 크롤러, 임베딩 처리 생태계가 Python에 강합니다.
- 발표/프로토타입용 API를 빠르게 만들 수 있습니다.
- 현재 레포가 이미 FastAPI 구조로 시작되어 있습니다.
- 백엔드 핵심 기능이 로그인, 교과과정 관리, 수강 이력, 졸업요건 계산, 챗봇 API 정도로 비교적 작습니다.

따라서 시스템 아키텍처 문서의 백엔드 표기는 다음처럼 보는 것이 맞습니다.

```text
Backend
  FastAPI
  SQLAlchemy
  Pydantic
  PostgreSQL
```

기존 그림에 있는 `Spring Boot`, `JPA`, `QueryDSL` 표기는 현재 구현 기준으로는 맞지 않습니다.

---

## 2. 전체 백엔드 역할

```text
Frontend
  ↓ REST API
FastAPI Backend
  ├─ Auth API
  ├─ Admin API
  ├─ Course Records API
  ├─ Graduation Progress API
  ├─ Recommendation API
  └─ Chat / RAG API
       ↓
PostgreSQL
  ├─ users
  ├─ academic_programs
  ├─ curriculum_courses
  ├─ graduation_requirements
  ├─ course_records
  ├─ ingested_documents
  └─ document_chunks

Crawler / Ingestion
  ├─ structured parser → PostgreSQL
  └─ document parser → VectorDB
```

---

## 3. 데이터 저장 원칙

크롤러가 수집하는 데이터는 성격에 따라 저장 위치를 나눕니다.

### PostgreSQL에 저장할 정형 데이터

졸업요건 계산처럼 정확한 규칙 계산이 필요한 데이터입니다.

- 학과/전공별 교과과정
- 과목명, 과목번호, 학점, 이수구분
- 입학년도/교과과정 연도별 졸업요건
- 학생 수강 이력
- 관리자 화면에서 수정할 데이터

학생의 학번에 따른 졸업요건은 VectorDB가 아니라 PostgreSQL에서 계산해야 합니다. 예를 들어 학번 또는 사용자 정보에서 입학년도, 학과, 전공을 확인하고 `academic_programs.curriculum_year`와 매칭합니다.

### VectorDB에 저장할 비정형 데이터

AI 상담에서 관련 문서를 찾아 답변하기 위한 데이터입니다.

- 학사 공지
- 장학/인턴/채용 공지
- 졸업요건 안내 PDF/HTML
- 교과목 안내 문서
- 학사 규정 문서

권장 흐름은 다음과 같습니다.

```text
Crawler
  ├─ 교과과정/졸업요건 파싱
  │   └─ PostgreSQL 업데이트
  │
  └─ 공지/PDF/문서 수집
      ├─ chunking
      ├─ embedding
      └─ VectorDB 저장
```

초기 간이 구현에서는 VectorDB를 바로 완성하기보다, 크롤러 설계와 저장 구조를 먼저 잡고 VectorDB는 mock 또는 pgvector/Qdrant 중 하나로 확정한 뒤 붙입니다.

---

## 4. 현재 구현된 API

### Auth

- `POST /api/auth/signup` — 학생 회원가입
- `POST /api/auth/login` — 학생 로그인
- `GET /api/auth/me` — 내 정보 조회

### Admin

- `POST /api/admin/login` — 관리자 로그인
- `POST /api/admin/programs` — 교과과정 생성
- `GET /api/admin/programs` — 교과과정 목록
- `PUT /api/admin/programs/{program_id}` — 교과과정 수정
- `DELETE /api/admin/programs/{program_id}` — 교과과정 삭제
- `POST /api/admin/crawl/run` — 수집된 교과과정/문서 데이터 수동 반영

### Course Records

- `POST /api/courses` — 내 수강 이력 추가
- `GET /api/courses/me` — 내 수강 이력 조회
- `DELETE /api/courses/{record_id}` — 내 수강 이력 삭제

### Graduation

- `GET /api/graduation/progress` — 졸업요건 충족률 계산
- `GET /api/graduation/recommend` — 다음 수강 과목/재수강 추천

### Chat

- `POST /api/chat` — 학생 이수현황 기반 상담 응답 (`OPENAI_API_KEY`가 있으면 OpenAI, 없으면 로컬 fallback)

---

## 5. 단계별 진행표

### Stage 1. 기반 구축

- [x] FastAPI 앱 생성
- [x] PostgreSQL 연결 설정
- [x] SQLAlchemy 모델 기반 DB 초기화
- [x] CORS 설정
- [x] `/api/health` 헬스체크

### Stage 2. 인증

- [x] 학생 회원가입
- [x] 학생 로그인
- [x] JWT 발급
- [x] `Authorization: Bearer <token>` 기반 현재 사용자 조회

### Stage 3. 관리자 교과과정 관리

- [x] 관리자 로그인
- [x] 교과과정 생성
- [x] 교과과정 목록 조회
- [x] 교과과정 수정
- [x] 교과과정 삭제
- [x] 졸업요건/과목 목록 함께 저장

### Stage 4. 수강 이력

- [x] `course_records` 테이블 추가
- [x] `CourseRecord` 모델 추가
- [x] 수강 이력 추가 API
- [x] 내 수강 이력 조회 API
- [x] 수강 이력 삭제 API

### Stage 5. 졸업요건 계산

- [x] 학생 학과/전공 기준 교과과정 탐색
- [x] 이수구분별 취득 학점 계산
- [x] 졸업요건 대비 남은 학점 계산
- [x] 전체 학점 충족률 계산
- [x] 다음 수강 과목 추천
- [x] 재수강 추천

### Stage 6. 크롤러/데이터 수집

- [x] 수집 데이터 저장 테이블 생성
- [x] 교과과정/졸업요건 정형 데이터 upsert 로직 작성
- [x] 공지/PDF/문서 텍스트 저장 로직 작성
- [x] 문서 chunking 로직 작성
- [x] 관리자 수동 실행 API 추가
- [ ] 실제 크롤러 폴더 구조 생성
- [ ] 수집 대상 URL 설정 구조 작성
- [ ] VectorDB 저장 방식 확정

### Stage 7. AI 상담/RAG

- [x] OpenAI SDK 추가
- [x] 채팅 요청/응답 스키마 작성
- [x] 학생 수강 이력 + 졸업요건 컨텍스트 생성
- [x] `/api/chat` 엔드포인트 작성
- [x] OpenAI 없이 동작하는 로컬 상담 응답 작성
- [x] OpenAI Responses API 선택적 연동
- [ ] VectorDB 검색 결과 컨텍스트 추가
- [ ] SSE 스트리밍 또는 일반 JSON 응답 방식 확정

### Stage 8. 배포 전 정리

- [ ] JWT secret을 `.env` 필수값으로 전환
- [ ] 관리자 계정/토큰 하드코딩 제거
- [ ] rate limiting 추가
- [ ] Dockerfile 작성
- [ ] docker-compose 작성
- [ ] 마이그레이션 실행 방법 정리

---

## 6. 파일 구조

```text
backend/
  migrations/
    001_initial_schema.sql
    002_course_records.sql
    003_ingestion_documents.sql
  seeds/
    001_academic_programs.sql
  src/
    admin/
      router.py
      schemas.py
    auth/
      router.py
      schemas.py
      service.py
    courses/
      router.py
      schemas.py
    graduation/
      router.py
      schemas.py
    chat/
      router.py
      schemas.py
    services/
      graduation.py
      ingestion.py
      chat.py
    database.py
    main.py
    models.py
  requirements.txt
```

---

## 7. 파일 정리 기준

현재 `backend/` 안에서 바로 삭제해도 될 정도로 불필요한 파일은 거의 없습니다. 다만 역할이 헷갈릴 수 있는 파일은 아래 기준으로 보면 됩니다.

### 유지하는 파일

| 파일/폴더 | 유지 이유 |
|---|---|
| `src/main.py` | FastAPI 앱 진입점입니다. 라우터 등록과 CORS 설정이 여기 있습니다. |
| `src/database.py` | DB 연결, 세션, SQLAlchemy Base를 관리합니다. |
| `src/models.py` | 현재는 모델 수가 적어서 한 파일에 모아두는 편이 단순합니다. 모델이 더 늘어나면 도메인별 분리합니다. |
| `src/auth/` | 학생 인증 라우터/스키마/서비스가 분리되어 있어 유지합니다. |
| `src/admin/` | 관리자 교과과정 CRUD가 별도 권한 흐름을 가지므로 유지합니다. |
| `src/courses/` | 수강 이력 API가 독립 도메인이므로 유지합니다. |
| `src/graduation/` | 졸업요건 API 스키마/라우터를 담당하므로 유지합니다. |
| `src/services/graduation.py` | 졸업요건 계산 로직은 라우터보다 서비스 계층에 두는 것이 테스트와 재사용에 좋습니다. |
| `src/services/ingestion.py` | 크롤러가 수집한 정형/비정형 데이터를 DB에 반영하는 공통 로직입니다. |
| `migrations/` | DB 스키마 변경 이력을 설명하고 수동 적용할 수 있게 해줍니다. |
| `seeds/` | 발표/테스트용 초기 교과과정 데이터를 재현하는 데 필요합니다. |
| `.env.example` | 팀원이 로컬 환경변수를 맞출 때 필요합니다. 실제 `.env`는 커밋하지 않습니다. |
| `requirements.txt` | Python 의존성 목록입니다. |

### 삭제하지 않는 것이 좋은 파일

| 파일/폴더 | 이유 |
|---|---|
| `__init__.py` 파일들 | Python 3에서는 없어도 import가 되는 경우가 많지만, 패키지 경계를 명확히 하므로 유지하는 편이 안전합니다. |
| `migrations/001_initial_schema.sql` | `Base.metadata.create_all()`과 역할이 겹쳐 보여도, DB 구조를 문서화하고 직접 적용할 때 필요합니다. |
| `migrations/002_course_records.sql` | 수강 이력 테이블 추가 이력을 별도로 남기는 파일이라 유지합니다. |

### 나중에 정리하면 좋은 파일

| 파일 | 정리 방향 |
|---|---|
| `seeds/001_academic_programs.sql` | 현재는 `pg_dump` 결과라 `\\restrict`, sequence set, dump 주석이 섞여 있습니다. 실행에는 도움이 되지만, 나중에는 사람이 읽기 쉬운 순수 `INSERT ... ON CONFLICT` 형태로 정리하는 것이 좋습니다. |
| `src/models.py` | 크롤러, 문서, 채팅, 벡터 메타데이터 모델이 추가되면 `src/models/` 패키지로 분리합니다. 지금은 한 파일 유지가 더 단순합니다. |
| `src/services/` | 서비스가 많아지면 `graduation.py`, `crawler.py`, `chat.py`, `rag.py`처럼 기능별로 확장합니다. |

### 통합하지 않는 것이 좋은 내용

- 라우터와 계산 로직은 합치지 않습니다. `router.py`는 HTTP 요청/응답만 담당하고, 계산은 `services/`에 두는 편이 좋습니다.
- `schemas.py`와 `models.py`는 합치지 않습니다. `models.py`는 DB 테이블, `schemas.py`는 API 입출력 구조라 역할이 다릅니다.
- `migrations/`와 `seeds/`는 합치지 않습니다. 마이그레이션은 테이블 구조, seed는 초기 데이터입니다.

---

## 8. 로컬 실행

의존성 설치:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

서버 실행:

```bash
uvicorn src.main:app --reload
```

헬스체크:

```bash
curl http://127.0.0.1:8000/api/health
```

---

## 9. 현재 주의할 점

- 현재는 프로토타입 단계라 `Base.metadata.create_all()`로 테이블을 생성합니다.
- 운영 배포 전에는 Alembic 같은 마이그레이션 도구 도입을 검토해야 합니다.
- 관리자 계정과 토큰은 현재 개발용 기본값이 있으므로 배포 전 반드시 `.env` 기반으로 정리해야 합니다.
- 졸업요건 계산은 현재 교과과정의 이수구분 문자열에 의존합니다. 실제 학교 데이터가 들어오면 이수구분 표준화 테이블을 추가하는 것이 좋습니다.
- VectorDB는 아직 확정하지 않았습니다. 간이 완성 단계에서는 PostgreSQL 중심으로 정형 데이터를 먼저 안정화합니다.
