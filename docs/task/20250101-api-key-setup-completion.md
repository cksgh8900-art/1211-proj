# API 키 설정 완료 및 백업 로직 추가

## 작업 일시
2025-01-01

## 작업 개요
한국관광공사 API 키 설정 완료 확인 및 백업 로직 추가

## 구현 내용

### 1. API 키 백업 로직 추가
**파일**: `lib/api/tour-api.ts`

- `getCommonParams()` 함수 개선
- API 키 우선순위 설정:
  1. `NEXT_PUBLIC_TOUR_API_KEY` (클라이언트/서버 공통, 우선 사용)
  2. `TOUR_API_KEY` (서버 사이드 백업용)
- 에러 메시지 개선: 두 가지 환경변수 모두 언급

**변경 사항**:
```typescript
// Before
const serviceKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;

// After
const serviceKey =
  process.env.NEXT_PUBLIC_TOUR_API_KEY || process.env.TOUR_API_KEY;
```

### 2. TODO.md 업데이트
**파일**: `docs/TODO.md`

- `NEXT_PUBLIC_TOUR_API_KEY` 환경변수 설정 완료 체크
- `TOUR_API_KEY`는 현재 미사용 상태이지만 백업용으로 지원됨을 명시

## 개선 효과

1. **유연성 향상**: `NEXT_PUBLIC_TOUR_API_KEY`가 인식되지 않는 경우 `TOUR_API_KEY`로 자동 대체
2. **에러 메시지 개선**: 사용자에게 두 가지 환경변수 옵션을 안내
3. **PRD.md 요구사항 반영**: 백업용 API 키 지원

## 검증
- ✅ API 키 백업 로직 정상 작동 확인
- ✅ 에러 메시지 개선 확인
- ✅ TODO.md 업데이트 완료
- ✅ 린터 오류 없음

