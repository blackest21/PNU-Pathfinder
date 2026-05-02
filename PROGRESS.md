# PNU-Pathfinder 진행 상황 (Progress Tracker)

> 이 파일은 세션이 끊기더라도 작업을 이어갈 수 있도록 모든 진행 상황을 기록합니다.
> 새 세션 시작 시 이 파일부터 읽으세요.

---

## 프로젝트 목적
제7회 PNU 창의융합AI해커톤 (자유주제 / 융합트랙) 출품
- **예선 마감**: 2026-05-11 (D-9)
- **최종 발표**: 2026-08-28 (농심호텔)
- **제출물**: 참가신청서 + 개발계획서 + PPT + 발표동영상

---

## 전체 단계별 상태

| 단계 | 내용 | 상태 | 파일 |
|---|---|---|---|
| **STAGE 1** | 예선 제출 자료 생성 (PPT + Word) | ✅ 완료 | [stage-1-submission.md](docs/stage-1-submission.md) |
| **STAGE 2** | Backend 구현 (수강이력 + OpenAI) | 🔄 다음 | [stage-2-backend.md](docs/stage-2-backend.md) |
| **STAGE 3** | Frontend 구현 (대시보드 + 챗봇) | ⏳ 대기 | [stage-3-frontend.md](docs/stage-3-frontend.md) |
| **STAGE 4** | 배포 (Vercel + VPS) | ⏳ 대기 | [stage-4-deploy.md](docs/stage-4-deploy.md) |
| **STAGE 5** | 본선 고도화 | ⏳ 대기 | [stage-5-advanced.md](docs/stage-5-advanced.md) |

---

## 현재 작업 중인 단계

### STAGE 1 — 완료 ✅
- `output/발표자료_PNU-Pathfinder.pptx` (11슬라이드, 47KB)
- `output/개발계획서_PNU-Pathfinder.docx` (9섹션, 41KB)
- **남은 작업**: 팀명·팀원 정보 직접 입력, 발표 동영상 촬영

### 다음 단계: STAGE 2 — Backend 구현
**시작 방법:** `docs/stage-2-backend.md` 읽고 "STAGE 2 시작해 줘" 입력

---

## 기술 스택 (실제 구현 기준)

| 구분 | 기술 |
|---|---|
| Frontend | React 19 + Vite 7 + TypeScript |
| Backend | FastAPI 0.136.1 + Python |
| DB | PostgreSQL + SQLAlchemy 2.0 (sync) |
| Auth | JWT (PyJWT) + bcrypt |
| AI | OpenAI API (예정) |
| 배포 | Vercel (FE) + VPS/Docker (BE) |

---

## 주요 파일 위치

```
PNU-pathfinder/
├── PROGRESS.md              ← 지금 이 파일 (전체 현황)
├── docs/
│   ├── agent-architecture.md  ← AI Agent MCP/Skills 설정 (핵심)
│   ├── stage-1-submission.md  ← PPT/Word 생성 진행상황
│   ├── stage-2-backend.md     ← 백엔드 구현 진행상황
│   ├── stage-3-frontend.md    ← 프론트엔드 구현 진행상황
│   └── stage-4-deploy.md      ← 배포 진행상황
├── scripts/
│   ├── generate_ppt.py      ← PPT 생성 (12슬라이드, Agent 아키텍처 포함)
│   └── generate_word.py     ← Word 생성 (10섹션, Agent 섹션 포함)
├── output/
│   ├── 발표자료_PNU-Pathfinder.pptx
│   └── 개발계획서_PNU-Pathfinder.docx
├── backend/
│   └── src/                 ← FastAPI 소스 (auth + admin 완성)
└── frontend/
    └── src/                 ← React 소스 (UI 틀 완성, mock 데이터)
```

---

## 갭 분석 (기획 vs 구현)

| 기능 | 상태 |
|---|---|
| 학생 인증 (회원가입/로그인) | ✅ 완성 |
| 학과별 졸업요건 DB + Admin CRUD | ✅ 완성 |
| 수강 이력 입력/조회 | ❌ 미구현 |
| 졸업요건 충족률 계산 로직 | ❌ 미구현 (UI만 mock) |
| AI 챗봇 (OpenAI 연동) | ❌ 미구현 (UI만 mock) |
| 수강 추천 로직 | ❌ 미구현 |
| What-if 시나리오 | ❌ placeholder |
| 이력서 생성 | ❌ placeholder |
