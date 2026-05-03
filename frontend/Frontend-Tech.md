# PNU-Pathfinder — Frontend Technology Reference

> **Canonical versions are in [Tech-Stack.md](../Tech-Stack.md).** This document explains the actual structure and conventions used in the codebase.
>
> **UI/UX specs:** [UI-UX-Specs.md](UI-UX-Specs.md) | **API contracts:** [../backend/API-Specs.md](../backend/API-Specs.md)

---

## 1. Actual Project Structure

```
frontend/
├── index.html
├── vite.config.ts           ← Vite + @vitejs/plugin-react
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── src/
│   ├── main.tsx             ← React root mount
│   ├── App.tsx              ← Page router (useState-based), auth state
│   ├── styles.css           ← Global CSS (custom animations, fonts, auth inputs)
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── CreditSummary.tsx
│   │   ├── GraduationRequirements.tsx
│   │   ├── Recommendations.tsx
│   │   ├── Section.tsx
│   │   ├── SemesterCard.tsx
│   │   ├── TableSection.tsx
│   │   └── Welcome.tsx
│   ├── pages/
│   │   ├── AuthPage.tsx             ← Login + Signup (mode prop)
│   │   ├── ChatPage.tsx             ← AI chat interface
│   │   ├── DataPage.tsx             ← Graduation requirements / course data
│   │   ├── AdminInfoPage.tsx        ← Admin: view program info
│   │   ├── AdminProgramSearchPage.tsx ← Admin: search/manage programs
│   │   └── PlaceholderPage.tsx      ← Reusable placeholder for future features
│   ├── services/
│   │   ├── authApi.ts               ← Calls /api/auth/*
│   │   └── adminApi.ts              ← Calls /api/admin/*
│   │   ├── chatApi.ts               ← Calls /api/chat
│   │   └── recommendationsApi.ts    ← Calls /api/recommendations/*
│   └── data/
│       └── mockData.ts              ← Mock AI responses for development
```

---

## 2. Key Libraries & Their Roles

| Library | Version | Role |
|---|---|---|
| `react` | ^19.0.0 | UI component model |
| `react-dom` | ^19.0.0 | DOM rendering |
| `typescript` | ^6.0.3 | Static typing |
| `vite` | ^7.0.0 | Dev server + production bundler |
| `@vitejs/plugin-react` | ^5.0.0 | Fast Refresh + JSX transform |
| `lucide-react` | ^0.468.0 | Icon library |
| Google Fonts | — | `Noto Sans KR` (body), `Space Mono` (mono class) |

---

## 3. Routing

There is **no routing library**. All page navigation is handled in `App.tsx` via:

```tsx
const [currentPage, setCurrentPage] = useState('chat');
```

Pages are rendered conditionally:
```tsx
{currentPage === 'chat' && <ChatPage />}
{currentPage === 'data' && <DataPage />}
```

Pass `setCurrentPage` (as `onNavigate`) down to components that need to trigger navigation.

---

## 4. Auth State

- Stored in `localStorage`:
  - `pnu-pathfinder-token` — JWT string
  - `pnu-pathfinder-user` — JSON-serialized user object
- `currentUser` is read from `localStorage` on app load (`useEffect` in `App.tsx`).
- On logout, both keys are removed and `currentUser` is set to `null`.
- Admin detection: `currentUser?.role === 'admin'`.

---

## 5. API Service Layer

All backend calls go through `frontend/src/services/`. Never call `fetch` directly in a component.

```ts
// Pattern used in service files
const token = localStorage.getItem('pnu-pathfinder-token');
const res = await fetch(`http://localhost:8000/api/auth/me`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

The backend base URL is currently hardcoded as `http://localhost:8000`. Move this to a Vite env var (`VITE_API_BASE_URL`) before adding other environments.

---

## 6. Styling

- **No CSS framework installed.** Tailwind-like utility class names (e.g., `flex`, `gap-2`, `text-sm`) appear to rely on a Tailwind CDN or are plain class name strings mapped to inline styles — confirm the actual setup in `index.html`.
- Custom styles are in `src/styles.css`:
  - Font imports (Noto Sans KR, Space Mono)
  - `.chat-scroll` scrollbar override
  - `.recommendation-card` hover transition
  - `fadeIn` animation, `.fade-in` class
  - `.typing-dot` blinking animation
  - `.auth-input` form input styles

---

## 7. Running Locally

```bash
cd frontend
npm install        # or: pnpm install
cp ../.env.example .env.local  # if Vite env vars are needed

npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript check (no emit)
npm run build      # Production build (tsc + vite build)
```

Backend must be running on `http://localhost:8000` for API calls to work.

---

## 8. Backend Integration Notes

- Backend CORS allows `http://localhost:5173` and `http://127.0.0.1:5173`.
- If you change the Vite dev port, update the CORS config in `backend/src/main.py`.
- See [../backend/Backend-Tech.md](../backend/Backend-Tech.md) for how to start the backend.

---

## 9. Planned Recommendation Integration

The frontend should expand from course-only planning to a broader student opportunity dashboard.

Implemented service files:

```text
frontend/src/services/
  recommendationsApi.ts   ← GET /api/recommendations/opportunities
  chatApi.ts              ← POST /api/chat and source metadata
```

Planned UI surfaces:

- Chat answer source citations from `used_sources`
- Recommendation tabs:
  - Courses
  - Extracurricular
  - Certificates
  - Jobs / Internships
  - Labs / Research
- Deadline-aware cards for extracurricular and certificate schedules
- Lab/research cards with professor, keywords, department, and source link

Frontend should keep all backend calls in `src/services/` and avoid direct `fetch` calls inside page components.
