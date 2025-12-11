# 검색 기능 구현

## 작업 일자
2025-01-01

## 작업 개요
Phase 2의 검색 기능(MVP 2.3)을 구현했습니다. 사용자가 키워드로 관광지를 검색하고, 검색 결과를 필터와 조합하여 정확한 관광지 정보를 찾을 수 있도록 구현했습니다.

## 구현 내용

### 1. TourSearch 컴포넌트 (`components/tour-search.tsx`)

**주요 기능**:
- 검색창 UI (Input 컴포넌트 사용)
- 검색 아이콘 (lucide-react Search)
- 엔터 키 또는 검색 버튼 클릭으로 검색 실행
- 검색어 초기화 버튼 (검색어가 있을 때만 표시)
- URL 쿼리 파라미터로 키워드 관리 (`keyword` 파라미터)
- 검색 중 로딩 스피너 표시

**구현 세부사항**:
- Client Component (`"use client"`)
- `useSearchParams`로 현재 검색어 읽기
- `useRouter().push()`로 URL 업데이트 (스크롤 방지)
- 두 가지 variant 제공: `default`, `compact`
- 반응형 디자인 (모바일/데스크톱)

### 2. Navbar 통합 (`components/Navbar.tsx`)

**변경 사항**:
- 데스크톱 검색창: `disabled` 속성 제거하고 `TourSearch` 컴포넌트로 교체 (`variant="compact"`)
- 모바일 검색 버튼: 클릭 시 검색창 표시 (드롭다운 형태)
- 검색창 너비: 모바일 최소 300px, 데스크톱 500px (PRD 요구사항 준수)

### 3. 검색 API 연동 (`app/page.tsx`)

**TourListData 함수 업데이트**:
- `searchParams`에서 `keyword` 파라미터 읽기
- 키워드가 있으면 `searchKeyword()` 호출
- 키워드가 없으면 기존 `getAreaBasedList()` 호출

**검색 + 필터 조합 로직**:
- 검색 모드와 목록 모드 분리
- 키워드 + 지역 필터: `searchKeyword({ keyword, areaCode })`
- 키워드 + 타입 필터: `searchKeyword({ keyword, contentTypeId })`
- 키워드 + 지역 + 타입 필터: `searchKeyword({ keyword, areaCode, contentTypeId })`
- 다중 타입 필터: 여러 타입별로 `searchKeyword()` 병렬 호출 후 결과 합치기

**정렬 처리**:
- 검색 결과도 클라이언트 사이드 정렬 (최신순/이름순)
- 결과 개수 제한 (12개)

### 4. 검색 결과 표시 (`components/tour-list.tsx`)

**변경 사항**:
- `TourList` 컴포넌트에 `searchKeyword` prop 추가
- 검색 결과 헤더 컴포넌트 추가 (`SearchResultHeader`)
  - 검색어와 결과 개수 표시 (예: "경복궁" 검색 결과 15개)
- 빈 상태 메시지 개선: 검색 결과 없음 시 검색어 포함 메시지 표시

### 5. URL 쿼리 파라미터 구조

**파라미터 정의**:
- `keyword`: 검색 키워드 (예: `?keyword=경복궁`)
- 기존 파라미터와 조합 가능: `?keyword=경복궁&area=1&type=12&sort=latest`

**예시 URL**:
- 검색만: `/?keyword=경복궁`
- 검색 + 지역: `/?keyword=경복궁&area=1`
- 검색 + 타입: `/?keyword=경복궁&type=12`
- 검색 + 지역 + 타입: `/?keyword=경복궁&area=1&type=12&sort=latest`

## 파일 변경 사항

### 새로 생성된 파일
- `components/tour-search.tsx`: 검색 컴포넌트
- `docs/task/20250101-search-functionality.md`: 작업 문서

### 수정된 파일
- `components/Navbar.tsx`: 
  - TourSearch 컴포넌트 통합
  - 모바일 검색 버튼 활성화
- `app/page.tsx`: 
  - `TourListData` 함수에 검색 키워드 처리 로직 추가
  - 검색 + 필터 조합 로직 구현
  - 검색 모드와 목록 모드 분리
- `components/tour-list.tsx`: 
  - 검색 결과 헤더 컴포넌트 추가
  - `searchKeyword` prop 추가
  - 빈 상태 메시지 개선
- `docs/TODO.md`: 작업 완료 표시

## 기술적 구현 사항

### 컴포넌트 구조

```
components/
├── tour-search.tsx (Client Component)
│   ├─ URL 쿼리 파라미터 관리
│   └─ 검색 실행 및 초기화
├── Navbar.tsx (Client Component)
│   └─ TourSearch 통합 (데스크톱/모바일)
└── tour-list.tsx (Client Component)
    ├─ SearchResultHeader (검색 결과 헤더)
    └─ TourListEmpty (빈 상태 - 검색어 포함)

app/
└── page.tsx (Server Component)
    └─ TourListData
        ├─ 검색 모드: searchKeyword() 호출
        └─ 목록 모드: getAreaBasedList() 호출
```

### 데이터 흐름

1. 사용자가 검색어 입력
2. `TourSearch` 컴포넌트가 URL 쿼리 파라미터 업데이트
3. Next.js가 페이지 리렌더링 (searchParams 변경 감지)
4. `TourListData`가 새로운 searchParams를 읽어 검색 모드 판단
5. 검색 모드인 경우 `searchKeyword()` 호출, 필터 적용
6. 받은 데이터를 정렬 처리
7. 정렬된 데이터를 `TourList`에 전달 (검색어 정보 포함)
8. `TourList`가 검색 결과 헤더와 함께 표시

### 검색 + 필터 조합 로직

**검색 모드 분기**:
- 키워드가 있으면: 검색 모드 (`searchKeyword()` 사용)
- 키워드가 없으면: 목록 모드 (`getAreaBasedList()` 사용)

**필터 조합**:
- 검색 모드에서도 기존 필터 로직과 동일하게 처리
- 단일 타입: 단일 API 호출
- 다중 타입: 병렬 API 호출 후 결과 합치기 (중복 제거)

### 반응형 디자인

- 데스크톱: Navbar에 `compact` variant로 검색창 표시
- 모바일: 검색 아이콘 클릭 시 드롭다운으로 검색창 표시 (`default` variant)

### 에러 처리

- 검색 API 실패 시 기존 에러 처리 로직 활용
- 빈 검색어 처리 (검색 실행 방지, URL에서 제거)

### 접근성

- 검색창에 ARIA 라벨 추가 (`aria-label="관광지 검색"`)
- 검색 버튼에 명확한 라벨 제공
- 키보드 네비게이션 지원 (엔터 키로 검색)

## 테스트 시나리오

1. 기본 검색: 키워드만 입력하여 검색
2. 검색 + 지역 필터: 검색어와 지역 필터 조합
3. 검색 + 타입 필터: 검색어와 타입 필터 조합
4. 검색 + 모든 필터: 검색어, 지역, 타입, 정렬 모두 조합
5. 검색 결과 없음: 검색 결과가 0개인 경우 메시지 표시
6. 검색어 초기화: 검색어를 지우고 전체 목록으로 복귀
7. URL 공유: 검색 결과 URL을 다른 사용자와 공유

## 참고 사항

- 검색 변경 시 URL이 업데이트되므로 브라우저 히스토리에 추가됨 (뒤로가기 지원)
- 검색어 초기화 버튼은 검색어가 있을 때만 표시
- 검색 결과도 클라이언트 사이드에서 정렬하여 빠른 반응 속도 제공
- 검색 결과 개수는 실제 표시된 항목 수 (최대 12개 제한 전)
- 다중 타입 필터가 있는 경우 병렬 API 호출로 성능 최적화

## 다음 단계

- Phase 2.5: 네이버 지도 연동
- Phase 2.6: 페이지네이션 또는 무한 스크롤

