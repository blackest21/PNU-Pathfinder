# Contributing to PNU-Pathfinder

> Read this document before making your first commit. Following this workflow prevents merge conflicts and keeps the history clean for all collaborators.

---

## 1. Branch Strategy (Git Flow–inspired)

```
main
 └── develop          ← integration branch; always deployable
      ├── feature/*   ← new features
      ├── fix/*        ← bug fixes
      ├── docs/*       ← documentation only
      └── chore/*      ← tooling, deps, CI
```

### Branch Rules

| Branch | Purpose | Who merges | Direct push? |
|---|---|---|---|
| `main` | Production-ready releases | PM / Architect via PR | **No** |
| `develop` | Latest integrated work | Any member via PR | **No** |
| `feature/<name>` | Feature development | Author via PR → develop | Yes |
| `fix/<name>` | Bug fixes | Author via PR → develop | Yes |
| `docs/<name>` | Docs only | Author via PR → develop | Yes |
| `chore/<name>` | Tooling / CI | Author via PR → develop | Yes |

### Naming Convention

```
feature/rag-pipeline-setup
feature/chat-ui-component
fix/qdrant-connection-timeout
docs/update-api-specs
chore/upgrade-fastapi-0.112
```

---

## 2. Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <short summary>

[optional body — explain WHY, not what]

[optional footer: closes #<issue-number>]
```

### Types
| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Build, tooling, dependency updates |
| `refactor` | Code change that is neither fix nor feat |
| `test` | Adding or updating tests |
| `style` | Formatting, whitespace (no logic change) |

### Examples
```
feat(backend): add /api/v1/chat endpoint with RAG pipeline
fix(frontend): resolve streaming response race condition
docs(api): add pagination parameters to GET /documents
chore(deps): upgrade langchain to 0.2.5
```

---

## 3. Pull Request Checklist

Before opening a PR, confirm:

- [ ] Branch is up to date with `develop` (`git rebase origin/develop`)
- [ ] All linting passes locally (`ruff check .` / `pnpm lint`)
- [ ] Type checks pass (`mypy .` / `pnpm type-check`)
- [ ] New endpoints are documented in `backend/API-Specs.md`
- [ ] New UI components are documented in `frontend/UI-UX-Specs.md`
- [ ] `.env.example` updated if new env vars were added
- [ ] `Tech-Stack.md` updated if a new library was added

PR title must follow the same Conventional Commits format as commit messages.

Require **at least 1 approval** before merging. The author cannot self-approve.

---

## 4. Release Flow

1. Accumulate features in `develop` until a release milestone is reached.
2. Create a PR from `develop` → `main` titled `release: vX.Y.Z`.
3. After merge, tag the commit: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`.
4. Push the tag: `git push origin vX.Y.Z`.

---

## 5. First-Time Setup

```bash
# 1. Clone
git clone https://github.com/blackest21/PNU-Pathfinder.git
cd PNU-Pathfinder

# 2. Set the develop branch as your default working branch
git checkout develop

# 3. Create your feature branch
git checkout -b feature/your-feature-name

# 4. Install pre-commit hooks (backend)
pip install pre-commit
pre-commit install

# 5. Copy environment file
cp .env.example .env
# Fill in your local values
```
