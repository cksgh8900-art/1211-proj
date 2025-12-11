# 작업 완료: 공통 컴포넌트 구현

**작업 일시**: 2025-01-01  
**Phase**: Phase 1 - 기본 구조 & 공통 설정  
**작업 항목**: 공통 컴포넌트

## 작업 내용

### 1. 로딩 스피너 컴포넌트 (`components/ui/loading.tsx`)

**구현 내용**:
- **기본 로딩 스피너**:
  - lucide-react의 `Loader2` 아이콘 사용 (자동 애니메이션)
  - 크기 variants: `sm`, `md`, `lg`
  - 색상: primary 색상 사용
  - 선택적 텍스트 표시

- **전체 화면 로딩 오버레이**:
  - `fullScreen` prop으로 전체 화면 모드 지원
  - 백드롭 블러 효과 (`backdrop-blur-sm`)
  - 반투명 배경 (`bg-background/80`)

- **Props**:
  ```typescript
  interface LoadingProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    fullScreen?: boolean;
    text?: string;
  }
  ```

- **접근성**:
  - `role="status"` 및 `aria-label="로딩 중"` 속성 추가
  - 스크린 리더 지원

### 2. 스켈레톤 UI 컴포넌트 (`components/ui/skeleton.tsx`)

**구현 내용**:
- **shadcn/ui Skeleton 컴포넌트 설치**:
  - `pnpx shadcn@latest add skeleton` 실행

- **스켈레톤 variants**:
  - `default`: 기본 스켈레톤 (일반 컨텐츠용)
  - `card`: 카드 스켈레톤 (관광지 카드용)
    - 이미지 영역 + 텍스트 영역 포함
    - 높이 256px, 전체 너비
  - `image`: 이미지 스켈레톤 (이미지 로딩용)
    - aspect-video 비율
  - `text`: 텍스트 스켈레톤 (여러 줄 텍스트용)
    - `lines` prop으로 줄 수 지정 가능
    - 마지막 줄은 3/4 너비로 표시

- **Props**:
  ```typescript
  interface SkeletonProps {
    className?: string;
    variant?: "default" | "card" | "image" | "text";
    lines?: number; // 텍스트 variant일 때 줄 수
  }
  ```

### 3. 에러 메시지 컴포넌트 (`components/ui/error.tsx`)

**구현 내용**:
- **에러 메시지 컴포넌트**:
  - lucide-react의 `AlertCircle`, `WifiOff` 아이콘 사용
  - 에러 타입별 메시지 표시 (API 에러, 네트워크 에러, 일반 에러)
  - 재시도 버튼 (optional)
  - 사용자 친화적인 에러 메시지

- **Props**:
  ```typescript
  interface ErrorMessageProps {
    title?: string;
    message: string;
    type?: "api" | "network" | "general";
    onRetry?: () => void;
    className?: string;
  }
  ```

- **에러 타입별 처리**:
  - API 에러: "데이터를 불러올 수 없습니다" + 재시도 버튼
  - 네트워크 에러: "인터넷 연결 확인" + 재시도 버튼
  - 일반 에러: 사용자 정의 메시지

- **스타일링**:
  - destructive 색상 테마
  - 경계선 및 배경 색상 적용
  - 중앙 정렬 레이아웃

- **접근성**:
  - `role="alert"` 및 `aria-live="assertive"` 속성
  - 재시도 버튼에 `aria-label` 추가

### 4. 토스트 알림 컴포넌트 (`components/ui/sonner.tsx`)

**구현 내용**:
- **shadcn/ui Sonner Toast 설치**:
  - `pnpx shadcn@latest add sonner` 실행
  - Sonner는 shadcn/ui에서 권장하는 toast 라이브러리

- **Toast Provider 설정**:
  - `app/layout.tsx`에 `<Toaster />` 추가
  - 위치: `top-center`
  - next-themes와 통합 (다크/라이트 모드 지원)

- **기능**:
  - 성공, 에러, 정보, 경고, 로딩 토스트 지원
  - 커스텀 아이콘 설정
  - 테마별 스타일 자동 적용

### 5. 토스트 유틸리티 함수 (`lib/utils/toast.ts`)

**구현 내용**:
- **토스트 헬퍼 함수**:
  - `showToast.success()`: 성공 메시지 (3초)
  - `showToast.error()`: 에러 메시지 (5초)
  - `showToast.info()`: 정보 메시지 (3초)
  - `showToast.warning()`: 경고 메시지 (4초)
  - `showToast.loading()`: 로딩 토스트
  - `showToast.promise()`: Promise 완료 시 자동 토스트

- **사용 예시**:
  ```typescript
  import { showToast } from '@/lib/utils/toast';
  
  showToast.success('URL이 복사되었습니다');
  showToast.error('오류가 발생했습니다');
  showToast.info('정보를 확인하세요');
  ```

## 기술적 구현 사항

### 설치된 패키지

- `sonner`: Toast 알림 라이브러리 (shadcn/ui를 통해 설치됨)

### 컴포넌트 구조

- 모든 컴포넌트는 `components/ui/` 디렉토리에 위치
- TypeScript strict 모드 준수
- Tailwind CSS로 스타일링
- lucide-react 아이콘 사용

### 반응형 및 접근성

- 모든 컴포넌트 반응형 디자인
- ARIA 라벨 및 접근성 속성 추가
- 키보드 네비게이션 지원 (에러 메시지의 재시도 버튼)

## 파일 변경 내역

- `components/ui/loading.tsx`: 새로 생성
- `components/ui/skeleton.tsx`: shadcn/ui 설치 후 variants 추가
- `components/ui/error.tsx`: 새로 생성
- `components/ui/sonner.tsx`: shadcn/ui를 통해 설치
- `lib/utils/toast.ts`: 새로 생성
- `app/layout.tsx`: Toaster 컴포넌트 추가

## 다음 단계

- Phase 2에서 `tour-list.tsx`에서 스켈레톤 UI 사용
- Phase 2에서 `naver-map.tsx`에서 로딩 스피너 사용
- Phase 3에서 URL 복사 완료 시 토스트 표시
- Phase 3에서 북마크 추가/제거 시 토스트 표시
- API 호출 시 에러 메시지 컴포넌트 사용

