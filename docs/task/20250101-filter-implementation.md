# 필터 기능 구현

## 작업 일자
2025-01-01

## 작업 개요
Phase 2의 필터 기능을 구현했습니다. 지역 필터, 관광 타입 필터, 정렬 옵션을 제공하고, 필터 상태를 URL 쿼리 파라미터로 관리하여 공유 가능한 링크를 지원합니다.

## 구현 내용

### 1. TourFilters 컴포넌트 (`components/tour-filters.tsx`)

**주요 기능**:
- 지역 필터: 드롭다운으로 시/도 선택 (전체 옵션 포함)
- 관광 타입 필터: 버튼 그룹으로 다중 선택 (8가지 타입)
- 정렬 옵션: 드롭다운으로 최신순/이름순 선택
- URL 쿼리 파라미터 기반 상태 관리

**구현 세부사항**:
- Client Component (`"use client"`)
- `useSearchParams`로 현재 URL 파라미터 읽기
- `useRouter().push()`로 URL 업데이트 (스크롤 방지)
- shadcn/ui Select 컴포넌트 사용 (지역, 정렬)
- shadcn/ui Button 컴포넌트 사용 (타입 필터 - 다중 선택)
- 필터 초기화 버튼 (활성 필터가 있을 때만 표시)
- 반응형 디자인 (모바일: 세로 배치, 데스크톱: 가로 배치)

### 2. 지역 목록 로딩 (`app/page.tsx`)

**주요 기능**:
- Server Component에서 `getAreaCode()` 호출
- 지역 목록을 `TourFilters` 컴포넌트에 props로 전달
- Suspense를 사용한 로딩 상태 처리

**구현 세부사항**:
- `AreaCodesData` Server Component 함수 생성
- 에러 처리 (지역 목록 로드 실패 시 빈 배열로 처리)

### 3. 필터 적용 로직 (`app/page.tsx`)

**주요 기능**:
- URL 쿼리 파라미터 읽기 및 파싱
- 필터 값에 따라 API 호출
- 클라이언트 사이드 정렬 처리

**구현 세부사항**:
- `TourListData` 함수가 `searchParams`를 인자로 받음
- 필터 값 파싱:
  - `area`: 지역 코드 (단일 값)
  - `type`: 관광 타입 ID (다중 값 지원, 현재는 첫 번째만 사용)
  - `sort`: 정렬 옵션 ("latest" 또는 "name")
- `getAreaBasedList()` 호출 시 필터 값 전달
- 정렬 로직:
  - 최신순: `modifiedtime` 기준 내림차순
  - 이름순: `title` 기준 오름차순 (한국어 로케일)
- 정렬된 데이터를 `TourList` 컴포넌트에 전달

### 4. URL 쿼리 파라미터 구조

**파라미터 정의**:
- `area`: 지역 코드 (예: `?area=1` - 서울)
- `type`: 관광 타입 ID (다중 선택 시: `?type=12&type=14`)
- `sort`: 정렬 옵션 (`?sort=latest` 또는 `?sort=name`)

**예시 URL**:
- 전체 조회: `/`
- 서울 지역: `/?area=1`
- 관광지 타입: `/?type=12`
- 서울 + 관광지: `/?area=1&type=12`
- 서울 + 관광지 + 최신순: `/?area=1&type=12&sort=latest`

### 5. 정렬 로직

**구현 방법**:
- 클라이언트 사이드 정렬
- API에서 데이터를 받은 후 JavaScript로 정렬
- `TourListData` 함수에서 정렬 처리

**정렬 기준**:
- 최신순: `modifiedtime` 기준 내림차순 (`Date` 객체로 변환하여 비교)
- 이름순: `title` 기준 오름차순 (한국어 로케일 사용)

### 6. shadcn/ui 컴포넌트 추가

**설치된 컴포넌트**:
- `components/ui/select.tsx`: Select 컴포넌트
- `components/ui/checkbox.tsx`: Checkbox 컴포넌트 (향후 사용 예정)

## 파일 변경 사항

### 새로 생성된 파일
- `components/tour-filters.tsx`
- `components/ui/select.tsx` (shadcn/ui)
- `components/ui/checkbox.tsx` (shadcn/ui)
- `docs/task/20250101-filter-implementation.md`

### 수정된 파일
- `app/page.tsx`: 
  - `searchParams` async 지원
  - 지역 목록 로드 (`AreaCodesData`)
  - 필터 값에 따른 API 호출 및 정렬 로직
  - `TourFilters` 컴포넌트 통합
- `components/tour-list.tsx`: `sort` prop 추가 (타입 정의)
- `docs/TODO.md`: 작업 완료 표시

## 기술적 구현 사항

### 컴포넌트 구조

```
app/page.tsx (Server Component)
  ├─ AreaCodesData (Server Component)
  │   └─ getAreaCode() 호출
  │       └─ TourFilters (Client Component)
  │           └─ URL 업데이트
  └─ TourListData (Server Component)
      └─ searchParams 읽기
          └─ getAreaBasedList() 호출
              └─ 정렬 처리
                  └─ TourList (Client Component)
```

### 데이터 흐름

1. `app/page.tsx`에서 `getAreaCode()` 호출하여 지역 목록 로드
2. `TourFilters` 컴포넌트에 지역 목록 전달
3. 사용자가 필터 변경
4. `TourFilters`가 URL 쿼리 파라미터 업데이트
5. Next.js가 페이지 리렌더링 (searchParams 변경 감지)
6. `TourListData`가 새로운 searchParams를 읽어 API 호출
7. 받은 데이터를 정렬 처리
8. 정렬된 데이터를 `TourList`에 전달

### URL 파라미터 관리

- Next.js 15 App Router의 `useSearchParams` (Client Component)
- `useRouter().push()`로 URL 업데이트 (스크롤 방지)
- Server Component에서는 `props.searchParams` 사용 (async)

### 반응형 디자인

- 데스크톱: 필터들이 가로로 배치 (`flex-row`)
- 모바일: 필터들이 세로로 배치 (`flex-col`)
- 필터 컨트롤의 최소 너비 설정 (`min-w-[150px]`)

### 제약사항

- **다중 타입 필터**: API가 단일 `contentTypeId`만 지원하므로, 현재는 첫 번째 선택된 타입만 사용합니다. 향후 개선이 필요합니다.
  - 해결 방안: 여러 타입을 선택한 경우 각 타입별로 API 호출하여 결과 합치기

## 테스트 결과

- 빌드 성공: `pnpm run build` 통과
- 타입 체크: 통과
- Lint: 경고 없음 (기존 tasks-example 경고는 제외)

## 참고 사항

- 필터 변경 시 URL이 업데이트되므로 브라우저 히스토리에 추가됨 (뒤로가기 지원)
- 필터 초기화 버튼은 활성 필터가 있을 때만 표시
- 정렬은 클라이언트 사이드에서 처리하여 빠른 반응 속도 제공
- 지역 목록 로드 실패 시 빈 배열로 처리하여 필터 UI는 계속 표시

## 추가 구현 (2025-01-01)

### 다중 타입 필터 지원

**구현 내용**:
- 여러 관광 타입을 선택한 경우, 각 타입별로 병렬 API 호출 (`Promise.all` 사용)
- 결과를 합치고 중복 제거 (contentid 기준, Map 사용)
- 정렬 후 최종 12개만 표시

**구현 세부사항**:
- 타입 필터가 0개: 전체 조회
- 타입 필터가 1개: 단일 API 호출 (기존 방식)
- 타입 필터가 2개 이상: 병렬 API 호출 후 결과 합치기
- 각 타입별로 12개씩 가져온 후, 중복 제거하여 정렬
- 최종적으로 12개만 표시

**성능 고려사항**:
- 병렬 API 호출로 성능 최적화
- 중복 제거를 위해 Map 사용 (O(1) 조회)
- 결과 개수 제한으로 불필요한 데이터 전송 방지

## 다음 단계

- Phase 2.4: 검색 기능 구현
- Phase 2.5: 네이버 지도 연동

