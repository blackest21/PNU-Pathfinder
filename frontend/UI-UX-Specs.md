# PNU-Pathfinder — UI/UX Specifications

> **Derived from actual source code** in `frontend/src/`. Update when pages or components change.
>
> **Cross-reference:** API endpoints consumed by this UI are defined in [../backend/API-Specs.md](../backend/API-Specs.md).
>
> **Tech reference:** [Frontend-Tech.md](Frontend-Tech.md)

---

## 1. Implemented Pages

| Page key | Component | Route condition | Who sees it |
|---|---|---|---|
| `chat` | `ChatPage.tsx` | Default for students | Logged-in students |
| `data` | `DataPage.tsx` | Sidebar nav | Logged-in students |
| `whatif` | `PlaceholderPage.tsx` | Sidebar nav | Logged-in students |
| `resume` | `PlaceholderPage.tsx` | Sidebar nav | Logged-in students |
| `login` | `AuthPage.tsx` (mode=login) | Not logged in | All |
| `signup` | `AuthPage.tsx` (mode=signup) | Link from login | All |
| `admin-program-search` | `AdminProgramSearchPage.tsx` | Admin default | Admin only |
| `admin-info` | `AdminInfoPage.tsx` | Admin nav | Admin only |

---

## 2. Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│                     <Header />                           │
│  [☰ Menu]  [Logo / Home]         [User info + Logout]   │
├───────────┬──────────────────────────────────────────────┤
│           │                                              │
│ <Sidebar/>│          <main> active page </main>         │
│ (student  │                                              │
│  only)    │                                              │
└───────────┴──────────────────────────────────────────────┘
```

- `Sidebar` is hidden for admin users (`isAdmin` flag in `App.tsx`).
- `Sidebar` is toggled via `sidebarOpen` state, opened by the Header menu button.

---

## 3. Component Inventory

| Component | File | Description |
|---|---|---|
| `Header` | `components/Header.tsx` | Top bar: menu toggle, logo/home link, user info, logout |
| `Sidebar` | `components/Sidebar.tsx` | Left nav: links to chat, data, what-if, resume pages |
| `ChatMessage` | `components/ChatMessage.tsx` | Single chat bubble (user or AI) |
| `TypingIndicator` | `components/TypingIndicator.tsx` | Animated dots while AI is responding |
| `CreditSummary` | `components/CreditSummary.tsx` | Progress bar / summary of completed credits |
| `GraduationRequirements` | `components/GraduationRequirements.tsx` | Graduation credit requirements table |
| `Recommendations` | `components/Recommendations.tsx` | Recommended course cards |
| `Section` | `components/Section.tsx` | Generic section wrapper with title |
| `SemesterCard` | `components/SemesterCard.tsx` | Per-semester course list card |
| `TableSection` | `components/TableSection.tsx` | Tabular data display wrapper |
| `Welcome` | `components/Welcome.tsx` | Onboarding / empty-state welcome message |
| `PlaceholderPage` | `pages/PlaceholderPage.tsx` | Reusable page for features not yet built |

---

## 4. Auth Flow (AuthPage)

`AuthPage` handles both login and signup via a `mode` prop.

```
[Login screen]
  student_id + password → POST /api/auth/login
  → on success: store token + user in localStorage, navigate to 'chat'

[Signup screen]
  name + student_id + password + department + major? + career_goal?
  → POST /api/auth/signup
  → on success: same as login
```

Error messages are shown inline (Korean language).

---

## 5. Design Tokens (Inferred from styles.css)

| Token | Value | Usage |
|---|---|---|
| Background (dark) | `#0f172a` | Auth input background |
| Border | `#334155` | Auth input border, scrollbar thumb |
| Text primary | `#f1f5f9` | Input text |
| Text muted | `#64748b` | Input placeholder |
| Accent (green) | `#10b981` | Auth input focus ring |
| Font (body) | `Noto Sans KR`, sans-serif | All body text |
| Font (mono) | `Space Mono`, monospace | `.mono` class |

> The overall color scheme appears to be **dark mode** (dark navy/slate backgrounds with light text and green accents).

---

## 6. Animations

| Class | Definition | Usage |
|---|---|---|
| `.fade-in` | `fadeIn` keyframe — opacity 0→1 + translateY 8px→0, 0.3s ease | Appearing messages, cards |
| `.typing-dot` | `blink` keyframe — opacity 0.3→1→0.3, 1.4s, staggered per dot | `TypingIndicator` component |
| `.recommendation-card` | `transform + box-shadow` hover transition, 0.2s | Course recommendation cards |

---

## 7. Planned UI (RAG Phase)

These screens do not exist yet and will be built when the RAG pipeline is ready.

| Screen | Description |
|---|---|
| Source citations panel | Displays source documents linked to each AI answer |
| Document explorer | Searchable list of indexed PNU documents |
| Opportunity dashboard | Unified recommendation page for extracurriculars, certificates, jobs, internships, and labs |
| Deadline cards | Compact cards showing application/test deadlines and eligibility |
| Lab/research explorer | Searchable lab/professor/research keyword view |
| What If? page | Replace placeholder with scenario comparison UI |
| Resume writer page | Replace placeholder with AI-assisted resume editor |

### Recommendation UI Groups

| Group | Primary fields |
|---|---|
| Courses | course name, category, credits, recommended semester, reason |
| Extracurricular | title, organizer, deadline, date range, target student, source |
| Certificates | certificate name, exam date, application deadline, career relevance |
| Jobs / Internships | company/source, role, deadline, required skills, relevance |
| Labs / Research | lab name, professor, department, research keywords, source |

---

## 8. Accessibility Notes (Current Gaps)

- [ ] No `aria-live` on streaming chat responses yet.
- [ ] `TypingIndicator` dots need `aria-label` for screen readers.
- [ ] Focus management on page transitions (useState routing has no native focus reset).
- [ ] Confirm color contrast ratios meet WCAG 2.1 AA for the dark theme.
