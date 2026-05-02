# STAGE 3 — Frontend 구현

**상태**: ⏳ 대기 (STAGE 2 완료 후 시작)

---

## 목표
현재 mock 데이터로 동작하는 UI를 실제 백엔드 API와 연동하고, 미구현 페이지를 완성한다.

---

## 체크리스트

### Phase 3-A: API 연동 (mock → 실제)
- [ ] `frontend/src/services/courseApi.ts` 생성
  - [ ] `addCourse()`, `getCourses()`, `deleteCourse()`
- [ ] `frontend/src/services/graduationApi.ts` 생성
  - [ ] `getProgress()`, `getRecommendations()`
- [ ] `frontend/src/services/chatApi.ts` 생성 (SSE 스트리밍)
- [ ] `frontend/src/data/mockData.ts` → 실제 API 호출로 교체

### Phase 3-B: DataPage 완성
- [ ] 수강 이력 입력 폼 (과목명, 학점, 성적, 학기)
- [ ] 영역별 졸업요건 충족률 프로그레스 바 (실제 데이터)
- [ ] 추천 과목 카드 (API 연동)
- [ ] 재수강 우선순위 리스트

### Phase 3-C: ChatPage 완성
- [ ] SSE 스트리밍 응답 렌더링
- [ ] 학생 이수현황 컨텍스트 자동 포함
- [ ] 대화 히스토리 유지

### Phase 3-D: What-if 페이지
- [ ] 복수전공 시뮬레이션 폼
- [ ] 시나리오별 결과 비교 UI

### Phase 3-E: 이력서 생성 페이지
- [ ] 학업 이력 자동 정리 UI
- [ ] AI 생성 버튼 + 결과 편집기

---

## 컴포넌트 추가 계획

| 컴포넌트 | 파일 | 용도 |
|---|---|---|
| `CourseInputForm` | `components/CourseInputForm.tsx` | 수강 이력 입력 |
| `GraduationChart` | `components/GraduationChart.tsx` | 충족률 시각화 |
| `RecommendCard` | `components/RecommendCard.tsx` | 추천 과목 카드 |
| `ChatStream` | `components/ChatStream.tsx` | SSE 스트리밍 렌더링 |
| `WhatIfForm` | `components/WhatIfForm.tsx` | 시나리오 입력 폼 |

---

## 이어하기 방법
새 세션에서 중단됐을 경우:
1. `PROGRESS.md` → STAGE 3 상태 확인
2. 이 파일 체크리스트 미완성 항목 확인
3. `frontend/src/` 폴더 현재 구조 확인
4. 미완성 항목부터 Frontend Agent 실행
