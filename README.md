# PNU-Pathfinder

> An AI-powered academic information assistant for Pusan National University students, built on RAG (Retrieval-Augmented Generation) technology.

## Problem Statement

Academic information at PNU is fragmented across departmental websites, portals, and bulletin boards. Students struggle to find accurate, up-to-date answers about courses, scholarships, deadlines, and administrative procedures.

**PNU-Pathfinder** solves this by ingesting all institutional documents into a unified vector knowledge base and serving precise, source-cited answers through a conversational interface.

---

## Key Features

| Feature | Description |
|---|---|
| RAG-based Q&A | Retrieves relevant document chunks and generates grounded answers |
| Source Citations | Every answer links back to its source document |
| Multi-domain Coverage | Courses, scholarships, facilities, schedules, regulations |
| Korean / English | Bilingual support for international students |

---

## Repository Structure

```
PNU-Pathfinder/
├── README.md                  ← You are here
├── Tech-Stack.md              ← Canonical technology & version matrix
├── CONTRIBUTING.md            ← Git workflow, branch strategy, code standards
├── .gitignore
│
├── docs/
│   ├── Project-Planning.md    ← Goals, milestones, team roles
│   ├── System-Architecture.md ← High-level design, data flow, deployment
│   └── Presentation-Materials.md ← Slide outline & script template
│
├── backend/
│   ├── API-Specs.md           ← REST endpoint contracts
│   └── Backend-Tech.md        ← Server stack, libraries, conventions
│
└── frontend/
    ├── UI-UX-Specs.md         ← Screens, components, design tokens
    └── Frontend-Tech.md       ← Client stack, tooling, conventions
```

---

## Quick Start

> Detailed setup instructions will be added per-service once scaffolding is complete.

```bash
# Clone
git clone https://github.com/blackest21/PNU-Pathfinder.git
cd PNU-Pathfinder

# See CONTRIBUTING.md for branch strategy before making any changes
```

---

## Team

| Name | Role | Responsibilities |
|---|---|---|
| TBD | PM / Architect | Repository structure, documentation, integration |
| TBD | Backend Engineer | FastAPI server, RAG pipeline, vector DB |
| TBD | Frontend Engineer | Next.js UI, component library |
| TBD | ML / Data Engineer | Embedding models, document ingestion |

---

## License

TBD — to be defined before public release.
