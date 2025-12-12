# Phase 6: 전역 에러 핸들링 구현 완료

**작업일**: 2025-01-01  
**Phase**: Phase 6 - 최적화 & 배포  
**작업 항목**: 전역 에러 핸들링

## 구현 내용

### 1. app/error.tsx 생성 (라우트 세그먼트 에러 처리)

#### 1.1 기본 구조
- Client Component로 구현 (`"use client"`)
- Next.js 15의 Error Boundary 패턴 사용
- `error` prop (Error 객체) 및 `reset` prop (에러 리셋 함수) 받기
- 에러 타입에 따른 분기 처리

#### 1.2 에러 UI 구현
- 사용자 친화적인 에러 메시지 표시
  - 에러 아이콘 (AlertCircle, destructive 색상)
  - 에러 제목 및 설명
  - 에러 타입별 맞춤 메시지
- 재시도 버튼
  - `reset()` 함수 호출
  - RefreshCw 아이콘
- 홈으로 돌아가기 버튼
  - Next.js Link 사용
  - `/` 경로로 이동
  - Home 아이콘

#### 1.3 에러 타입별 처리
- **API 에러** (`TourApiError`)
  - "데이터를 불러오는 중 문제가 발생했습니다" 메시지
- **네트워크 에러**
  - "인터넷 연결을 확인하고 다시 시도해주세요" 메시지
  - fetch 실패, 타임아웃 등 감지
- **인증 에러** (Clerk)
  - "인증에 문제가 발생했습니다. 로그인을 다시 시도해주세요" 메시지
- **데이터베이스 에러** (Supabase)
  - "데이터베이스 연결에 문제가 발생했습니다" 메시지
- **일반 JavaScript 에러**
  - "예상치 못한 오류가 발생했습니다" 메시지
  - 개발 환경에서 스택 트레이스 표시

#### 1.4 개발 환경 디버깅 정보
- `<details>` 태그로 접을 수 있는 에러 상세 정보
- 에러 이름, 메시지, digest, 스택 트레이스 표시
- 프로덕션 환경에서는 숨김 처리

#### 1.5 접근성
- `role="alert"` 및 `aria-live="assertive"` 속성
- 모든 버튼에 `aria-label` 추가
- 아이콘에 `aria-hidden="true"` 추가
- 키보드 네비게이션 지원

### 2. app/global-error.tsx 생성 (루트 레이아웃 에러 처리)

#### 2.1 기본 구조
- Client Component로 구현 (`"use client"`)
- 루트 레이아웃의 에러만 처리
- `<html>`, `<body>` 태그 포함 (layout.tsx를 대체)

#### 2.2 에러 UI 구현
- 최소한의 레이아웃 구조
  - 기본 HTML 구조 (`<html>`, `<body>`)
  - Tailwind CSS 기본 스타일
  - `antialiased` 클래스 적용
- 에러 메시지 표시
  - AlertTriangle 아이콘 (더 큰 크기, 16x16)
  - "심각한 오류가 발생했습니다" 제목
  - 애플리케이션 전체 크래시 안내 메시지
- 재시도 버튼
  - `reset()` 함수 호출
- 홈으로 돌아가기 버튼
  - `window.location.href = "/"` 사용 (Link 컴포넌트 사용 불가)

#### 2.3 개발 환경 디버깅 정보
- `app/error.tsx`와 동일한 에러 상세 정보 표시
- 프로덕션 환경에서는 숨김 처리

### 3. 에러 로깅 유틸리티 (lib/utils/error-logger.ts)

#### 3.1 에러 정보 수집
- `collectErrorInfo()` 함수
  - 에러 메시지, 스택, 이름, digest 수집
  - 브라우저 환경에서 URL, User Agent 수집
  - 타임스탬프 추가

#### 3.2 에러 로깅 함수
- `logError()`: 기본 에러 로깅 함수
  - 개발 환경: 상세한 에러 정보를 콘솔에 출력 (console.group 사용)
  - 프로덕션 환경: 간단한 로깅
  - 외부 로깅 서비스 연동 준비 (TODO 주석)
- `logGlobalError()`: 글로벌 에러 로깅
- `logRouteError()`: 라우트 세그먼트 에러 로깅

#### 3.3 프로덕션 환경 로깅 준비
- Sentry, LogRocket, Datadog 등 외부 로깅 서비스 연동 준비
- TODO 주석으로 향후 확장 가능성 명시

### 4. 에러 처리 계층 구조

```
에러 발생
  │
  ├─ 루트 레이아웃 에러? → global-error.tsx
  │   (layout.tsx의 에러)
  │
  ├─ 라우트 세그먼트 에러? → error.tsx
  │   (페이지/라우트의 에러)
  │
  └─ 컴포넌트 레벨 에러? → ErrorMessage 컴포넌트
      (부분적인 기능 에러)
```

### 5. 에러 타입별 사용자 안내 메시지

| 에러 타입 | 사용자 안내 메시지 |
|----------|------------------|
| API 에러 (TourApiError) | "데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." |
| 네트워크 에러 | "인터넷 연결을 확인하고 다시 시도해주세요." |
| 인증 에러 (Clerk) | "인증에 문제가 발생했습니다. 로그인을 다시 시도해주세요." |
| 데이터베이스 에러 (Supabase) | "데이터베이스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요." |
| 일반 에러 | "예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요." |

## 생성된 파일

1. `app/error.tsx` - 라우트 세그먼트 에러 처리 컴포넌트
2. `app/global-error.tsx` - 루트 레이아웃 에러 처리 컴포넌트
3. `lib/utils/error-logger.ts` - 에러 로깅 유틸리티 함수
4. `docs/task/20250101-phase6-global-error-handling.md` - 작업 문서

## 수정된 파일

1. `docs/TODO.md` - Phase 6 전역 에러 핸들링 항목 체크 및 추가 개발 사항 기록

## 주요 특징

### 사용자 경험
1. **명확한 에러 메시지**: 에러 타입별 맞춤 안내 메시지
2. **복구 옵션 제공**: 재시도 및 홈으로 돌아가기 버튼
3. **시각적 피드백**: 아이콘 및 색상으로 에러 심각도 표시

### 개발자 경험
1. **상세한 디버깅 정보**: 개발 환경에서 에러 상세 정보 표시
2. **구조화된 로깅**: 에러 정보를 구조화하여 로깅
3. **에러 타입 인식**: 에러 타입별 자동 분류 및 처리

### 안정성
1. **전역 에러 처리**: 예상치 못한 에러도 안전하게 처리
2. **에러 격리**: 에러가 발생해도 앱 전체가 크래시되지 않음
3. **프로덕션 준비**: 프로덕션 환경에서 안정적인 에러 처리

## 참고 파일

- [app/error.tsx](../../app/error.tsx) - 라우트 세그먼트 에러 처리
- [app/global-error.tsx](../../app/global-error.tsx) - 루트 레이아웃 에러 처리
- [app/layout.tsx](../../app/layout.tsx) - 루트 레이아웃
- [components/ui/error.tsx](../../components/ui/error.tsx) - ErrorMessage 컴포넌트
- [lib/utils/error-logger.ts](../../lib/utils/error-logger.ts) - 에러 로깅 유틸리티
- [lib/api/tour-api.ts](../../lib/api/tour-api.ts) - TourApiError 클래스
- [docs/PRD.md](../PRD.md) - 프로젝트 요구사항
- [docs/TODO.md](../TODO.md) - Phase 6 작업 목록

## 향후 개선 사항

1. **외부 로깅 서비스 연동**: Sentry, LogRocket 등 프로덕션 에러 모니터링
2. **에러 리포트 기능**: 사용자가 에러를 직접 리포트할 수 있는 기능
3. **에러 통계**: 에러 발생 빈도 및 패턴 분석

---

**작성자**: AI Assistant  
**작성일**: 2025-01-01

