# STAGE 1 — 예선 제출 자료 생성

**마감**: 2026-05-11 | **상태**: 🔄 진행중

---

## 체크리스트

- [x] python-pptx, python-docx 설치
- [x] 기획서 PDF 내용 파악
- [x] 개발계획서 Word 생성 → `output/개발계획서_PNU-Pathfinder.docx` ✅ 2026-05-02
- [x] 발표 PPT 생성 → `output/발표자료_PNU-Pathfinder.pptx` ✅ 2026-05-02
- [ ] 팀명 / 팀원 정보 입력 필요
- [ ] 발표 동영상 촬영 (직접)

---

## 제출 파일명 규칙
`융합트랙_PNU-Pathfinder_[팀명]`

---

## PPT 슬라이드 구성 (7~10분)

| # | 제목 | 시간 |
|---|---|---|
| 1 | 표지 | - |
| 2 | 문제 정의 — 정보 파편화 | 1분 |
| 3 | 타겟 사용자 | 30초 |
| 4 | 솔루션 개요 — PNU-Pathfinder | 1분 |
| 5 | 핵심 기능 1 — Smart Planner | 1분 |
| 6 | 핵심 기능 2 — Interactive Roadmap | 30초 |
| 7 | 핵심 기능 3 — AI 챗봇 | 1분 |
| 8 | AI 활용 계획 | 1분 |
| 9 | 시스템 아키텍처 | 1분 |
| 10 | MVP 범위 & 개발 일정 | 1분 |
| 11 | 기대효과 & 차별성 | 30초 |
| 12 | 팀 구성 | 30초 |

---

## 이어하기 방법
새 세션에서 중단됐을 경우:
1. `PROGRESS.md` 확인 → STAGE 1 상태 확인
2. 이 파일에서 체크리스트 미완성 항목 확인
3. `output/` 폴더에 생성된 파일 확인
4. 아래 생성 스크립트 재실행:
   ```bash
   python3 PNU-pathfinder/scripts/generate_ppt.py
   python3 PNU-pathfinder/scripts/generate_word.py
   ```
