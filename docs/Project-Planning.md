# PNU-Pathfinder — Project Planning

---

## 1. Project Overview

| Field | Value |
|---|---|
| Project Name | PNU-Pathfinder |
| Goal | Eliminate academic information fragmentation at PNU using a RAG-powered conversational assistant |
| Target Users | PNU students (undergraduate & graduate), international students |
| Competition / Deadline | TBD — update when competition guidelines are received |
| Repository | https://github.com/blackest21/PNU-Pathfinder |

---

## 2. Problem Definition

PNU students currently face:
- **Information fragmentation:** Answers scattered across 10+ departmental sites.
- **Outdated content:** Manual site updates lag behind policy changes.
- **Language barrier:** Most resources are Korean-only.
- **High support load:** Administrative staff repeat-answer the same questions.

**Solution:** A single RAG-based assistant that retrieves the most relevant institutional document chunks and generates accurate, source-cited answers in real time.

---

## 3. Team Roles & Responsibilities

| Member | Role | Core Responsibilities |
|---|---|---|
| TBD | PM / Lead Architect | Planning, integration, documentation, code review |
| TBD | Backend Engineer | FastAPI server, RAG pipeline, Qdrant integration |
| TBD | Frontend Engineer | Next.js chat UI, component library |
| TBD | ML / Data Engineer | Document ingestion, embeddings, retrieval tuning |

> Update this table with actual names before the first sprint.

---

## 4. Milestones

| # | Milestone | Target Date | Status |
|---|---|---|---|
| M0 | Repository setup, documentation scaffolding | 2026-05-09 | In Progress |
| M1 | Backend skeleton: FastAPI + Qdrant running in Docker | TBD | Not Started |
| M2 | RAG pipeline: ingest PNU docs, basic Q&A working | TBD | Not Started |
| M3 | Frontend: chat UI connected to backend | TBD | Not Started |
| M4 | End-to-end demo with real PNU data | TBD | Not Started |
| M5 | Competition submission / presentation ready | TBD | Not Started |

---

## 5. Sprint Structure

- Sprint length: **1 week**
- Sprint kick-off: **Monday** (sync meeting, update this table)
- Sprint review: **Friday** (demo + retrospective)
- Communication: GitHub Issues + PR comments (primary), KakaoTalk (async)

---

## 6. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| PNU website structure changes during scraping | Medium | High | Store raw HTML snapshots; re-ingest on change |
| LLM API cost overrun | Medium | Medium | Cache frequent queries; use cheaper model for dev |
| Team member availability near exam period | High | Medium | Front-load architecture work; document everything |
| Competition format changes | Low | High | Monitor official channels; keep proposal modular |

---

## 7. Definition of Done

A task is "done" when:
1. Code is merged to `develop` via reviewed PR.
2. Relevant documentation (API-Specs, UI-UX-Specs) is updated.
3. No new linting errors introduced.
4. Feature is manually verified in the local Docker environment.
