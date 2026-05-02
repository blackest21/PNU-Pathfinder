# AI Agent 협업 아키텍처

> 이 문서는 PNU-Pathfinder 개발에 사용된 Claude 멀티 에이전트 협업 구조를 정의합니다.
> 새 세션에서 에이전트를 재실행할 때 이 파일을 기준으로 설정합니다.

---

## 1. 에이전트 구성 개요

```
PM Agent (Claude Sonnet 4.6)
├── 역할: 기획·문서·코드리뷰·진행관리
├── MCP: filesystem, github
└── Skills: review, security-review, init

        ↓ 태스크 분배

Backend Agent                    Frontend Agent
(Claude Sonnet 4.6)              (Claude Sonnet 4.6)
├── 역할: FastAPI, DB, AI 연동    ├── 역할: React UI, API 연동
├── MCP: filesystem,             ├── MCP: filesystem,
│        postgres,               │        github,
│        github                  │        puppeteer (UI 테스트)
└── Skills: claude-api,          └── Skills: simplify
             simplify
```

---

## 2. 에이전트별 MCP 서버 설정

### 2-1. PM Agent
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/Users/hyunwoocho/claude/PNU-pathfinder"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    }
  }
}
```

**이유:**
- `filesystem`: PROGRESS.md, stage MD 파일 읽기·쓰기
- `github`: Issue 생성, PR 리뷰, 브랜치 관리

---

### 2-2. Backend Agent
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/Users/hyunwoocho/claude/PNU-pathfinder/backend"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres",
               "postgresql://localhost/pnu_pathfinder"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    }
  }
}
```

**이유:**
- `filesystem`: `backend/src/` 코드 읽기·쓰기·실행
- `postgres`: DB 스키마 조회, 마이그레이션 검증, 쿼리 테스트
- `github`: `backend/` 변경사항 커밋·푸시

**필요한 Skills:**
- `claude-api` — OpenAI 연동 코드 패턴, 프롬프트 캐싱
- `simplify` — 작성한 코드 품질 검토

---

### 2-3. Frontend Agent
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/Users/hyunwoocho/claude/PNU-pathfinder/frontend"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

**이유:**
- `filesystem`: `frontend/src/` 컴포넌트·서비스 코드 작업
- `puppeteer`: 개발 서버 실행 후 UI 자동 스크린샷 검증
- `github`: `frontend/` 변경사항 커밋·푸시

**필요한 Skills:**
- `simplify` — 컴포넌트 중복 제거, 코드 품질 검토

---

## 3. Claude Code settings.json 전체 설정

`PNU-pathfinder/.claude/settings.json` 에 아래 내용 적용:

```json
{
  "model": "claude-sonnet-4-6",
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/Users/hyunwoocho/claude/PNU-pathfinder"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres",
               "postgresql://localhost/pnu_pathfinder"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>" }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  },
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(pip*)",
      "Bash(python3:*)",
      "Bash(git:*)",
      "Bash(uvicorn:*)",
      "Bash(psql:*)"
    ]
  }
}
```

---

## 4. 에이전트 실행 방법 (Claude Code CLI)

### PM Agent가 Backend Agent를 spawn하는 방식
```
# Claude Code 세션에서
"PROGRESS.md와 docs/stage-2-backend.md를 읽고
 Backend Agent로 Phase 2-A 수강이력 기능을 구현해 줘"
```

→ Claude Code가 내부적으로 `Agent(subagent_type="general-purpose")` 호출
→ Backend Agent는 `backend/` 폴더에 격리되어 작업
→ 작업 완료 후 PM Agent가 결과 리뷰

### 병렬 실행 (Backend + Frontend 동시)
```
"stage-2-backend.md의 Phase 2-A와
 stage-3-frontend.md의 Phase 3-A를
 Backend Agent와 Frontend Agent로 동시에 진행해 줘"
```

→ 두 Agent가 각자의 폴더에서 동시 작업
→ worktree 격리로 충돌 없음

---

## 5. MCP 설치 명령어

```bash
# 필수 MCP 서버 설치 (npx가 자동 처리하지만 미리 설치 가능)
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-puppeteer
```

---

## 6. 에이전트 협업 흐름도

```
1. PM Agent가 PROGRESS.md 읽음
         ↓
2. 현재 Stage 확인 → 해당 stage-N.md 체크리스트 로드
         ↓
3. 태스크를 Backend / Frontend로 분류
         ↓
4. 각 Agent spawn (병렬 또는 순차)
   - Backend Agent: postgres MCP로 DB 직접 확인하며 코드 작성
   - Frontend Agent: puppeteer MCP로 UI 렌더링 검증하며 작업
         ↓
5. 각 Agent가 git commit → PR 생성
         ↓
6. PM Agent가 PR 리뷰 (security-review skill)
         ↓
7. PROGRESS.md 체크리스트 업데이트
```

---

## 7. 발표에서 강조할 포인트

| 포인트 | 설명 |
|---|---|
| **역할 분리** | PM·Backend·Frontend Agent가 각자의 영역만 접근 |
| **MCP = 도구** | postgres MCP → Agent가 실제 DB 쿼리 실행 가능 |
| **검증 자동화** | puppeteer MCP → UI 변경 시 스크린샷으로 자동 검증 |
| **충돌 없는 병렬** | worktree 격리로 동시 작업해도 merge conflict 없음 |
| **이력 추적** | 모든 Agent 작업이 git commit으로 기록됨 |
