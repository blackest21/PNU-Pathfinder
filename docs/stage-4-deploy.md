# STAGE 4 — 배포

**상태**: ⏳ 대기 (STAGE 3 완료 후 시작)

---

## 목표
본선 제출 전 실제 접속 가능한 URL로 배포. 최종 발표(8/28) 시 시연 가능해야 함.

---

## 체크리스트

### Frontend 배포 (Vercel)
- [ ] `frontend/` Vercel 프로젝트 연결
- [ ] `VITE_API_BASE_URL` 환경변수 설정
- [ ] 빌드 확인 (`npm run build`)
- [ ] 배포 URL 확인 및 README에 기록

### Backend 배포 (Docker + VPS)
- [ ] `backend/Dockerfile` 작성
- [ ] `docker-compose.yml` 작성 (backend + postgres)
- [ ] `.env` 프로덕션 값 설정
  - [ ] `JWT_SECRET` 랜덤값으로 교체
  - [ ] `ADMIN_ID`, `ADMIN_PASSWORD`, `ADMIN_TOKEN` 교체
  - [ ] `OPENAI_API_KEY` 설정
- [ ] VPS에 Docker 배포
- [ ] HTTPS 설정 (nginx + certbot)

### DB 마이그레이션
- [ ] 프로덕션 DB에 모든 migration 파일 순서대로 적용
- [ ] 초기 데이터 seed 적용

---

## 이어하기 방법
새 세션에서 중단됐을 경우:
1. `PROGRESS.md` → STAGE 4 상태 확인
2. 이 파일 체크리스트 미완성 항목 확인
