# 관광지 목록 기능 구현 (MVP 2.1)

## 작업 일자
2025-01-01

## 작업 개요
Phase 2의 관광지 목록 기능을 구현했습니다. TourCard 컴포넌트, TourList 컴포넌트를 생성하고, API를 연동하여 실제 데이터를 표시하는 기능을 완성했습니다.

## 구현 내용

### 1. TourCard 컴포넌트 (`components/tour-card.tsx`)

**주요 기능**:
- 썸네일 이미지 표시 (firstimage 우선, 없으면 firstimage2, 둘 다 없으면 placeholder)
- 관광지명, 주소, 관광 타입 뱃지 표시
- 호버 효과 (scale, shadow)
- 클릭 시 `/places/[contentid]`로 이동

**구현 세부사항**:
- Next.js Image 컴포넌트 사용 (이미지 최적화)
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 접근성 고려 (ARIA 라벨, 키보드 네비게이션)
- `lib/types/stats.ts`의 `CONTENT_TYPE_NAME`, `AREA_CODE_NAME` 사용

### 2. TourList 컴포넌트 (`components/tour-list.tsx`)

**주요 기능**:
- 반응형 그리드 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 3열)
- 로딩 상태 (Skeleton UI)
- 빈 상태 처리
- 에러 처리 (재시도 기능 포함)

**구현 세부사항**:
- Phase 1에서 만든 `Skeleton`, `ErrorMessage` 컴포넌트 활용
- 기본 재시도 함수 제공
- 접근성 고려 (role="list", aria-label)

### 3. API 연동 (`app/page.tsx`)

**주요 기능**:
- Server Component에서 `getAreaBasedList()` 호출
- Suspense를 사용한 로딩 상태 처리
- 에러 처리

**구현 세부사항**:
- 초기 데이터: 전체 지역, 전체 타입, 12개 항목
- Server Component와 Client Component 분리
- `TourListData` Server Component 함수로 데이터 fetching

### 4. 타입 수정

**`lib/types/tour.ts`**:
- `AreaBasedListParams` 인터페이스 수정
  - `areaCode`, `contentTypeId`를 선택 사항으로 변경 (전체 조회 지원)

### 5. Next.js 설정 업데이트

**`next.config.ts`**:
- 한국관광공사 이미지 도메인 추가
  - `tong.visitkorea.or.kr`
  - `api.visitkorea.or.kr`

## 파일 변경 사항

### 새로 생성된 파일
- `components/tour-card.tsx`
- `components/tour-list.tsx`
- `docs/task/20250101-tour-list-implementation.md`

### 수정된 파일
- `app/page.tsx`: API 연동 및 TourList 컴포넌트 통합
- `lib/types/tour.ts`: `AreaBasedListParams` 타입 수정
- `next.config.ts`: 이미지 도메인 추가
- `docs/TODO.md`: 작업 완료 표시

## 테스트 결과

- 빌드 성공: `pnpm run build` 통과
- 타입 체크: 통과
- Lint: 경고 없음 (기존 tasks-example 경고는 제외)

## 참고 사항

- 이미지가 없는 경우 placeholder로 MapPin 아이콘 표시
- API 에러 발생 시 사용자 친화적인 메시지 표시
- 로딩 중에는 Skeleton UI로 UX 개선
- Server Component와 Client Component 분리로 성능 최적화

## 다음 단계

- Phase 2.3: 필터 기능 구현
- Phase 2.4: 검색 기능 구현
- Phase 2.5: 네이버 지도 연동

