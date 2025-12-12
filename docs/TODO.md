- [ ] `.cursor/` 디렉토리
  - [ ] `rules/` 커서룰
  - [ ] `mcp.json` MCP 서버 설정
  - [ ] `dir.md` 프로젝트 디렉토리 구조
- [ ] `.github/` 디렉토리
- [ ] `.husky/` 디렉토리
- [ ] `app/` 디렉토리
  - [ ] `favicon.ico` 파일
  - [ ] `not-found.tsx` 파일
  - [ ] `robots.ts` 파일
  - [ ] `sitemap.ts` 파일
  - [ ] `manifest.ts` 파일
- [ ] `supabase/` 디렉토리
- [ ] `public/` 디렉토리
  - [ ] `icons/` 디렉토리
  - [ ] `logo.png` 파일
  - [ ] `og-image.png` 파일
- [ ] `tsconfig.json` 파일
- [ ] `.cursorignore` 파일
- [ ] `.gitignore` 파일
- [ ] `.prettierignore` 파일
- [ ] `.prettierrc` 파일
- [ ] `tsconfig.json` 파일
- [ ] `eslint.config.mjs` 파일
- [ ] `AGENTS.md` 파일

# My Trip - 개발 TODO 리스트

> PRD, Flowchart, Design 문서 기반 작업 항목 정리

## Phase 1: 기본 구조 & 공통 설정

- [ ] 프로젝트 셋업
  - [x] 환경변수 설정 (`.env`)
    - [x] `NEXT_PUBLIC_TOUR_API_KEY` (한국관광공사 API)
    - [ ] `TOUR_API_KEY` (서버 사이드용, 현재 미사용 - NEXT_PUBLIC_TOUR_API_KEY로 대체)
    - [ ] `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` (네이버 지도)
    - [ ] Clerk 인증 키 확인
    - [ ] Supabase 키 확인
- [x] API 클라이언트 구현
  - [x] `lib/api/tour-api.ts` 생성
    - [x] `getAreaCode()` - 지역코드 조회 (`areaCode2`)
    - [x] `getAreaBasedList()` - 지역 기반 목록 (`areaBasedList2`)
    - [x] `searchKeyword()` - 키워드 검색 (`searchKeyword2`)
    - [x] `getDetailCommon()` - 공통 정보 (`detailCommon2`)
    - [x] `getDetailIntro()` - 소개 정보 (`detailIntro2`)
    - [x] `getDetailImage()` - 이미지 목록 (`detailImage2`)
    - [x] `getDetailPetTour()` - 반려동물 정보 (`detailPetTour2`)
    - [x] 공통 파라미터 처리 (serviceKey, MobileOS, MobileApp, \_type)
    - [x] 에러 처리 및 재시도 로직
  ***
  추가 개발 사항:
  - [x] `TourApiError` 커스텀 에러 클래스 구현
  - [x] 타임아웃 처리 (10초)
  - [x] 지수 백오프를 사용한 재시도 로직 (최대 3회)
  - [x] API 응답 형식 검증 및 타입 안전성 보장
  - [x] 단일 항목/배열 항목 자동 변환 처리
- [x] 타입 정의
  - [x] `lib/types/tour.ts` 생성
    - [x] `TourItem` 인터페이스 (목록)
    - [x] `TourDetail` 인터페이스 (상세)
    - [x] `TourIntro` 인터페이스 (운영정보)
    - [x] `TourImage` 인터페이스 (이미지)
    - [x] `PetTourInfo` 인터페이스 (반려동물)
  ***
  추가 개발 사항:
  - [x] `AreaCode` 인터페이스 추가
  - [x] `CONTENT_TYPE_ID` 상수 정의
  - [x] `TourApiResponse<T>` 제네릭 응답 래퍼 타입
  - [x] `TourApiErrorResponse` 에러 응답 타입
  - [x] 모든 API 함수 파라미터 타입 정의 (AreaCodeParams, AreaBasedListParams 등)
  - [x] contentTypeId별 상세한 TourIntro 필드 정의 (관광지, 문화시설, 축제, 여행코스, 레포츠, 숙박, 쇼핑, 음식점)
  - [x] `lib/types/stats.ts` 생성
    - [x] `RegionStats` 인터페이스
    - [x] `TypeStats` 인터페이스
    - [x] `StatsSummary` 인터페이스
  ***
  추가 개발 사항:
  - [x] `CONTENT_TYPE_NAME` 상수 매핑 (Content Type ID → 타입명)
  - [x] `AREA_CODE_NAME` 상수 매핑 (지역 코드 → 지역명)
- [x] 레이아웃 구조
  - [x] `app/layout.tsx` 업데이트
    - [x] 메타데이터 설정
    - [x] 헤더/푸터 구조 확인
  - [x] `components/Navbar.tsx` 업데이트
    - [x] 로고, 검색창, 로그인 버튼
    - [x] 네비게이션 링크 (홈, 통계, 북마크)
  - [x] `components/Footer.tsx` 생성
    - [x] 저작권 표시
    - [x] API 제공자 표시
    - [x] 반응형 레이아웃
- [x] 공통 컴포넌트
  - [x] `components/ui/loading.tsx` - 로딩 스피너
  - [x] `components/ui/skeleton.tsx` - 스켈레톤 UI
  - [x] `components/ui/error.tsx` - 에러 메시지
  - [x] `components/ui/sonner.tsx` - 토스트 알림 (shadcn/ui)
  - [x] `lib/utils/toast.ts` - 토스트 헬퍼 함수
  - [x] `app/layout.tsx`에 Toaster 컴포넌트 추가

## Phase 2: 홈페이지 (`/`) - 관광지 목록

- [x] 페이지 기본 구조
  - [x] `app/page.tsx` 생성
    - [x] 기본 레이아웃 (헤더, 메인, 푸터)
    - [x] 반응형 컨테이너 설정
    - [x] Hero Section 구조 생성 (데스크톱만)
    - [x] Filters & Controls 섹션 구조 생성 (Sticky)
    - [x] List/Map 영역 구조 생성 (2컬럼 그리드)
- [x] 관광지 목록 기능 (MVP 2.1)
  - [x] `components/tour-card.tsx` 생성
    - [x] 썸네일 이미지 (기본 이미지 fallback)
    - [x] 관광지명
    - [x] 주소 표시
    - [x] 관광 타입 뱃지
    - [x] 호버 효과 (scale, shadow)
    - [x] 클릭 시 상세페이지 이동
  - [x] `components/tour-list.tsx` 생성
    - [x] 그리드 레이아웃 (반응형)
    - [x] 카드 목록 표시
    - [x] 로딩 상태 (Skeleton UI)
    - [x] 빈 상태 처리
  - [x] API 연동
    - [x] `getAreaBasedList()` 호출
    - [x] 데이터 파싱 및 표시
    - [x] 에러 처리
  ***
  추가 개발 사항:
  - [x] `lib/types/tour.ts`의 `AreaBasedListParams` 인터페이스 수정 (`areaCode`, `contentTypeId` 선택 사항으로 변경)
  - [x] `next.config.ts`에 한국관광공사 이미지 도메인 추가 (tong.visitkorea.or.kr, api.visitkorea.or.kr)
  - [x] `TourList` 컴포넌트에 기본 재시도 함수 추가
- [x] 필터 기능
  - [x] `components/tour-filters.tsx` 생성
    - [x] 지역 필터 (시/도 선택)
      - [x] `getAreaCode()` API로 지역 목록 로드
      - [x] 드롭다운 (shadcn/ui Select)
      - [x] "전체" 옵션
    - [x] 관광 타입 필터
      - [x] 관광지(12), 문화시설(14), 축제/행사(15), 여행코스(25), 레포츠(28), 숙박(32), 쇼핑(38), 음식점(39)
      - [x] 다중 선택 가능 (버튼 그룹)
      - [x] "전체" 옵션 (선택 없음)
    - [x] 정렬 옵션
      - [x] 최신순 (modifiedtime)
      - [x] 이름순 (가나다)
    - [x] 필터 상태 관리 (URL 쿼리 파라미터)
  - [x] 필터 적용 로직
    - [x] 필터 변경 시 API 재호출
    - [x] 필터 조합 처리 (지역 + 타입 + 정렬)
  ***
  추가 개발 사항:
  - [x] shadcn/ui Select, Checkbox 컴포넌트 설치
  - [x] URL 쿼리 파라미터 구조 정의 (`area`, `type`, `sort`)
  - [x] Next.js 15 App Router의 async searchParams 지원
  - [x] 클라이언트 사이드 정렬 로직 구현 (최신순, 이름순)
  - [x] 필터 초기화 버튼 추가
  - [x] 반응형 디자인 (모바일: 세로 배치, 데스크톱: 가로 배치)
  - [x] 다중 타입 필터 지원
    - [x] 여러 타입 선택 시 각 타입별로 병렬 API 호출
    - [x] 결과 합치기 및 중복 제거 (contentid 기준)
    - [x] 정렬 후 결과 개수 제한 (12개)
- [x] 검색 기능 (MVP 2.3)
  - [x] `components/tour-search.tsx` 생성
    - [x] 검색창 UI (헤더 또는 메인 영역)
    - [x] 검색 아이콘
    - [x] 엔터 또는 버튼 클릭으로 검색
    - [x] 검색 중 로딩 스피너
  - [x] 검색 API 연동
    - [x] `searchKeyword()` 호출
    - [x] 검색 결과 표시
    - [x] 검색 결과 개수 표시
    - [x] 결과 없음 메시지
  - [x] 검색 + 필터 조합
    - [x] 키워드 + 지역 필터
    - [x] 키워드 + 타입 필터
    - [x] 모든 필터 동시 적용
  ***
  추가 개발 사항:
  - [x] `components/Navbar.tsx`에 TourSearch 컴포넌트 통합
  - [x] 모바일 검색 버튼 활성화 (드롭다운 형태)
  - [x] URL 쿼리 파라미터 구조 정의 (`keyword` 파라미터)
  - [x] 검색 + 필터 조합 로직 구현 (검색 모드와 목록 모드 분리)
  - [x] 다중 타입 필터 + 검색 병렬 처리
  - [x] 검색 결과 헤더 컴포넌트 추가 (검색어 및 결과 개수 표시)
- [x] 네이버 지도 연동 (MVP 2.2)
  - [x] `components/naver-map.tsx` 생성
    - [x] Naver Maps API v3 초기화
    - [x] 지도 컨테이너 설정
    - [x] 초기 중심 좌표 설정
    - [x] 줌 레벨 설정
  - [x] 마커 표시
    - [x] 관광지 목록을 마커로 표시
    - [x] 좌표 변환 (KATEC → WGS84: mapx/mapy / 10000000)
    - [x] 마커 클릭 시 인포윈도우
      - [x] 관광지명
      - [x] 간단한 설명
      - [x] "상세보기" 버튼
    - [x] 관광 타입별 마커 색상 구분 (선택 사항)
  - [x] 지도-리스트 연동
    - [x] 리스트 항목 클릭 → 지도 이동 및 마커 강조
    - [x] 리스트 항목 호버 → 마커 강조 (선택 사항)
    - [x] 마커 클릭 → 리스트 항목 강조
  - [x] 지도 컨트롤
    - [x] 줌 인/아웃 버튼 (네이버 지도 기본 컨트롤)
    - [x] 지도 유형 선택 (일반/스카이뷰)
    - [x] 현재 위치 버튼 (선택 사항)
  - [x] 반응형 레이아웃
    - [x] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할
    - [x] 모바일: 탭 형태로 리스트/지도 전환
  ***
  추가 개발 사항:
  - [x] `lib/utils/coordinate.ts` 좌표 변환 유틸리티 생성
  - [x] `components/list-map-view.tsx` 리스트-지도 통합 컴포넌트 생성
  - [x] `app/layout.tsx`에 Naver Maps API 스크립트 로드 추가
  - [x] 지도 로딩 상태 및 에러 처리 구현
  - [x] URL 쿼리 파라미터로 선택된 관광지 상태 관리 (`selectedId`)
  - [x] 모바일 뷰 모드 전환 (`view` 파라미터)
  - [x] Suspense로 useSearchParams 래핑
- [x] 페이지네이션
  - [x] 무한 스크롤 구현
    - [x] Intersection Observer 사용
    - [x] 하단 로딩 인디케이터
    - [x] 페이지당 12개 항목
  - [x] 페이지 번호 선택 방식
  ***
  추가 개발 사항:
  - [x] `lib/api/tour-api.ts`에서 `getAreaBasedList`와 `searchKeyword`가 `totalCount` 포함 객체 반환
  - [x] `actions/tours.ts` Server Actions 생성 (클라이언트에서 추가 페이지 데이터 로드)
  - [x] `components/tour-pagination.tsx` 생성 (페이지 번호 UI, 모드 전환 토글)
  - [x] `TourList`에 무한 스크롤 Intersection Observer 구현
  - [x] `TourList`에 페이지네이션 props 추가 (hasMore, isLoadingMore, onLoadMore 등)
  - [x] `ListMapView`에 페이지네이션 상태 관리 및 데이터 로드 로직 통합
  - [x] URL 쿼리 파라미터 처리 (`page`, `paginationMode`)
  - [x] 필터/검색 변경 시 페이지 리셋 로직 (`tour-filters.tsx`)
  - [x] 에러 처리 (추가 로드 실패 시 재시도 버튼, 에러 메시지)
- [x] 최종 통합 및 스타일링
  - [x] 모든 기능 통합 테스트
    - [x] 통합 테스트 체크리스트 문서 작성 (`docs/task/20250101-phase2-integration-test.md`)
  - [x] 반응형 디자인 확인 (모바일/태블릿/데스크톱)
    - [x] 필터 영역 반응형 개선 (모바일 간격, 레이아웃 조정)
    - [x] 페이지네이션 반응형 개선 (모바일에서 페이지 번호 버튼 최적화)
    - [x] 지도 높이 반응형 조정 (모바일 300px, 태블릿 500px, 데스크톱 600px)
  - [x] 로딩 상태 개선
    - [x] 필터 영역 로딩 fallback 개선 (Skeleton UI 적용)
    - [x] 무한 스크롤 로딩 인디케이터 스타일 개선 (프로그레스 바 추가)
  - [x] 에러 처리 개선
    - [x] 네트워크 오프라인 감지 기능 추가 (navigator.onLine API)
    - [x] API 에러 메시지 개선 (에러 코드별 사용자 친화적 메시지 매핑)
    - [x] 지도 에러 처리 개선 (API 로드 실패 시 명확한 안내, ErrorMessage 컴포넌트 사용)
  - [x] 접근성 개선
    - [x] 주요 컴포넌트에 ARIA 라벨 추가 (필터, 페이지네이션, 검색 결과, 지도)
    - [x] 키보드 네비게이션 지원 확인
    - [x] 검색 결과 영역에 aria-live 추가

## Phase 3: 상세페이지 (`/places/[contentId]`)

- [x] 페이지 기본 구조
  - [x] `app/places/[contentId]/page.tsx` 생성
    - [x] 동적 라우팅 설정 (Next.js 15 async params)
    - [x] 뒤로가기 버튼 (페이지 내부 상단)
    - [x] 기본 레이아웃 구조 (반응형 컨테이너, 섹션 준비)
    - [x] contentId 검증 및 에러 처리
    - [x] 라우팅 테스트
  ***
  추가 개발 사항:
  - [x] `components/tour-detail/back-button.tsx` 생성 (뒤로가기 버튼 컴포넌트)
  - [ ] `components/tour-detail/error-content.tsx` 생성 (에러 콘텐츠 컴포넌트, Client Component) - **미사용: ErrorMessage 컴포넌트로 대체**
  - [x] `app/places/[contentId]/not-found.tsx` 생성 (404 페이지)
  - [x] 접근성 개선 (aria-label 추가)
- [x] 기본 정보 섹션 (MVP 2.4.1)
  - [x] `components/tour-detail/detail-info.tsx` 생성
    - [x] `getDetailCommon()` API 연동
    - [x] 관광지명 (대제목)
    - [x] 대표 이미지 (크게 표시)
    - [x] 주소 표시 및 복사 기능
      - [x] 클립보드 API 사용
      - [x] 복사 완료 토스트
    - [x] 전화번호 (클릭 시 전화 연결)
    - [x] 홈페이지 (링크)
    - [x] 개요 (긴 설명문)
    - [x] 관광 타입 및 카테고리 뱃지
    - [x] 정보 없는 항목 숨김 처리
  ***
  추가 개발 사항:
  - [x] `components/tour-detail/copy-address-button.tsx` 생성 (주소 복사 버튼, Client Component)
  - [x] `components/tour-detail/detail-info-skeleton.tsx` 생성 (로딩 상태 스켈레톤 UI)
  - [x] `app/places/[contentId]/page.tsx`에 DetailInfo 컴포넌트 통합 (Suspense 사용)
  - [x] 홈페이지 URL 정규화 함수 (http:// 또는 https:// 자동 추가)
  - [x] 개요 텍스트 HTML 태그 제거 및 줄바꿈 처리
  - [x] 접근성 개선 (aria-label, 시맨틱 HTML)
- [x] 운영 정보 섹션 (MVP 2.4.2)
  - [x] `components/tour-detail/detail-intro.tsx` 생성
    - [x] `getDetailIntro()` API 연동
    - [x] 운영시간/개장시간
    - [x] 휴무일
    - [x] 이용요금
    - [x] 주차 가능 여부
    - [x] 수용인원
    - [x] 체험 프로그램
    - [x] 유모차/반려동물 동반 가능 여부
    - [x] 정보 없는 항목 숨김 처리
  ***
  추가 개발 사항:
  - [x] `components/tour-detail/detail-intro-skeleton.tsx` 생성 (로딩 상태 스켈레톤 UI)
  - [x] `app/places/[contentId]/page.tsx`에 DetailIntro 컴포넌트 통합 (Suspense 사용)
  - [x] contentTypeId별 필드 선택 로직 구현 (getOperatingHours, getRestDate, getUseFee 등)
  - [x] 정보 항목 컴포넌트 (InfoItem) 구현 (아이콘 + 라벨 + 값 구조)
  - [x] HTML 태그 제거 함수 (formatText) 구현
  - [x] 모든 정보가 없을 경우 섹션 숨김 처리 (null 반환)
  - [x] 타입별 추가 정보 표시 (할인정보, 규모, 관람 소요시간, 문의처)
  - [x] 접근성 개선 (aria-label, 시맨틱 HTML)
- [x] 이미지 갤러리 (MVP 2.4.3)
  - [x] `components/tour-detail/detail-gallery.tsx` 생성
    - [x] `getDetailImage()` API 연동
    - [x] 대표 이미지 + 서브 이미지들
    - [x] 이미지 슬라이드 기능 (Swiper 또는 캐러셀)
    - [x] 이미지 클릭 시 전체화면 모달
    - [x] 이미지 없으면 기본 이미지
    - [x] Next.js Image 컴포넌트 사용 (최적화)
  ***
  추가 개발 사항:
  - [x] Swiper 라이브러리 설치 및 설정
  - [x] `components/tour-detail/image-modal.tsx` 생성 (전체화면 모달, Client Component)
  - [x] `components/tour-detail/image-gallery-client.tsx` 생성 (갤러리 클라이언트 컴포넌트)
  - [x] `components/tour-detail/detail-gallery-skeleton.tsx` 생성 (로딩 상태 스켈레톤 UI)
  - [x] `app/places/[contentId]/page.tsx`에 DetailGallery 컴포넌트 통합 (Suspense 사용)
  - [x] 이미지 정렬 및 필터링 로직 구현 (serialnum 기준)
  - [x] 메인 이미지 슬라이더 및 썸네일 그리드 구현
  - [x] 썸네일 클릭 시 메인 이미지 변경 기능
  - [x] 전체화면 모달에서 Swiper 슬라이드 기능
  - [x] 키보드 네비게이션 (좌우 화살표, ESC) 구현
  - [x] 이미지 인덱스 표시 (현재 이미지 / 전체 이미지)
  - [x] 접근성 개선 (aria-label, 키보드 네비게이션)
- [x] 지도 섹션 (MVP 2.4.4)
  - [x] `components/tour-detail/detail-map.tsx` 생성
    - [x] 해당 관광지 위치 표시
    - [x] 마커 1개 표시
    - [x] "길찾기" 버튼
      - [x] 네이버 지도 앱/웹 연동
      - [x] URL: `https://map.naver.com/v5/directions/{좌표}`
    - [x] 좌표 정보 표시 (선택 사항)
  ***
  추가 개발 사항:
  - [x] `components/tour-detail/detail-map-client.tsx` 생성 (Client Component, 지도 렌더링)
  - [x] `components/tour-detail/detail-map-skeleton.tsx` 생성 (Skeleton UI)
  - [x] `app/places/[contentId]/page.tsx`에 DetailMap 컴포넌트 통합 (Suspense 사용)
  - [x] 좌표 변환 유틸리티 사용 (`convertKATECToWGS84`)
  - [x] 좌표 복사 기능 추가 (Copy 버튼)
  - [x] 좌표 정보 토글 기능 (표시/숨김)
  - [x] 네이버 지도 API 로드 실패 시 에러 처리
  - [x] 좌표가 없는 경우 섹션 숨김 처리
- [x] 공유 기능 (MVP 2.4.5)
  - [x] `components/tour-detail/share-button.tsx` 생성
    - [x] URL 복사 기능
      - [x] `navigator.clipboard.writeText()` 사용
      - [x] HTTPS 환경 확인
    - [x] 복사 완료 토스트 메시지
    - [x] 공유 아이콘 버튼 (Share/Link 아이콘)
  - [x] Open Graph 메타태그
    - [x] `app/places/[contentId]/page.tsx`에 Metadata 생성
    - [x] `og:title` - 관광지명
    - [x] `og:description` - 관광지 설명 (100자 이내)
    - [x] `og:image` - 대표 이미지 (1200x630 권장)
    - [x] `og:url` - 상세페이지 URL
    - [x] `og:type` - "website"
  ***
  추가 개발 사항:
  - [x] `generateMetadata` 함수 구현 (Next.js 15 Metadata API)
  - [x] HTML 태그 제거 함수 (`stripHtmlTags`) 구현
  - [x] Twitter Card 메타태그 추가 (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:images`)
  - [x] 이미지가 없는 경우 처리 (og:image 생략)
  - [x] 설명이 없는 경우 기본 설명 사용
  - [x] ShareButton을 상세페이지 헤더에 통합 (뒤로가기 버튼 옆)
  - [x] 반응형 디자인 (모바일에서 텍스트 숨김, 아이콘만 표시)
  - [x] 복사 상태 UI (Share2 아이콘 → Check 아이콘)
- [x] 북마크 기능 (MVP 2.4.5)
  - [x] `components/bookmarks/bookmark-button.tsx` 생성
    - [x] 별 아이콘 (채워짐/비어있음)
    - [x] 북마크 상태 확인 (Supabase 조회)
    - [x] 북마크 추가/제거 기능
    - [x] 인증된 사용자 확인 (Clerk)
    - [x] 로그인하지 않은 경우: 로그인 유도 (SignInButton 모달)
  - [x] Supabase 연동
    - [x] `actions/bookmarks.ts` 생성 (Server Actions)
      - [x] `getBookmark()` - 북마크 조회
      - [x] `addBookmark()` - 북마크 추가
      - [x] `removeBookmark()` - 북마크 제거
      - [x] `getUserBookmarks()` - 사용자 북마크 목록
    - [x] `bookmarks` 테이블 사용 (db.sql 참고)
      - [x] `user_id` (users 테이블 참조)
      - [x] `content_id` (한국관광공사 API contentid)
      - [x] UNIQUE 제약 (user_id, content_id)
  - [x] 상세페이지에 북마크 버튼 추가
  ***
  추가 개발 사항:
  - [x] Clerk user ID → Supabase user_id 매핑 함수 (`getSupabaseUserId`)
  - [x] 북마크 상태 실시간 업데이트 (useState, useEffect)
  - [x] 로딩 상태 처리 (isLoading, isToggling)
  - [x] 토스트 메시지 통합 (성공/실패 피드백)
  - [x] 에러 처리 (UNIQUE 제약 위반, 로그인 필요 등)
  - [x] 접근성 개선 (aria-label 추가)
- [x] 반려동물 정보 섹션 (MVP 2.5)
  - [x] `components/tour-detail/detail-pet-tour.tsx` 생성
    - [x] `getDetailPetTour()` API 연동
    - [x] 반려동물 동반 가능 여부 표시
    - [x] 반려동물 크기 제한 정보
    - [x] 반려동물 입장 가능 장소 (실내/실외)
    - [x] 반려동물 동반 추가 요금
    - [x] 반려동물 전용 시설 정보
    - [x] 아이콘 및 뱃지 디자인 (🐾)
    - [x] 주의사항 강조 표시
  ***
  추가 개발 사항:
  - [x] `components/tour-detail/detail-pet-tour-skeleton.tsx` 생성 (로딩 상태 스켈레톤 UI)
  - [x] `app/places/[contentId]/page.tsx`에 DetailPetTour 컴포넌트 통합 (Suspense 사용)
  - [x] InfoItem 컴포넌트 패턴 사용 (DetailIntro와 동일한 구조)
  - [x] 정보가 없는 경우 섹션 숨김 처리 (null 반환)
  - [x] 에러 처리 구현 (ErrorMessage 컴포넌트 사용)
  - [x] HTML 태그 제거 함수 (formatText) 구현
  - [x] 접근성 개선 (aria-label, 시맨틱 HTML)
  - [x] 반응형 디자인 적용
- [ ] 추천 관광지 섹션 (선택 사항)
  - [ ] 같은 지역 또는 타입의 다른 관광지 추천
  - [ ] 카드 형태로 표시
- [x] 최종 통합 및 스타일링
  - [x] 모든 섹션 통합
  - [x] 반응형 디자인 확인
  - [x] 모바일 최적화
  - [x] 접근성 확인 (ARIA 라벨, 키보드 네비게이션)

## Phase 4: 통계 대시보드 페이지 (`/stats`)

- [x] 페이지 기본 구조
  - [x] `app/stats/page.tsx` 생성
    - [x] 기본 레이아웃 구조
    - [x] 반응형 레이아웃 설정 (모바일 우선)
    - [x] Server Component로 구현
  ***
  추가 개발 사항:
  - [x] 메타데이터 설정 (export const metadata, Open Graph, Twitter Card)
  - [x] 스켈레톤 UI 컴포넌트 추가 (StatsSummarySkeleton, ChartSkeleton)
  - [x] Suspense 경계 설정 (각 섹션별 독립적 로딩)
  - [x] 접근성 요소 추가 (시맨틱 HTML, aria-label, 섹션 구조)
- [x] 통계 데이터 수집
  - [x] `lib/api/stats-api.ts` 생성
    - [x] `getRegionStats()` - 지역별 관광지 개수 집계
      - [x] `areaBasedList2` API로 각 지역별 totalCount 조회
      - [x] 지역 코드별로 API 호출
    - [x] `getTypeStats()` - 타입별 관광지 개수 집계
      - [x] `areaBasedList2` API로 각 타입별 totalCount 조회
      - [x] contentTypeId별로 API 호출
    - [x] `getStatsSummary()` - 전체 통계 요약
      - [x] 전체 관광지 수
      - [x] Top 3 지역
      - [x] Top 3 타입
      - [x] 마지막 업데이트 시간
    - [x] 병렬 API 호출로 성능 최적화
    - [x] 에러 처리 및 재시도 로직
    - [x] 데이터 캐싱 (revalidate: 3600)
  ***
  추가 개발 사항:
  - [x] Promise.all을 사용한 병렬 API 호출 구현
  - [x] 개별 API 호출 실패 시 부분 데이터 반환 (null 필터링)
  - [x] 개발 환경에서 성능 모니터링 로깅 (소요 시간 측정)
  - [x] 타입 안전성 보장 (TypeScript 타입 가드 사용)
  - [x] percentage(백분율) 계산 로직 구현 (getTypeStats)
  - [x] 에러 복구 로직 (개별 실패해도 계속 진행)
  - [x] 캐싱 전략 문서화 (페이지 레벨에서 설정 필요)
- [x] 통계 요약 카드
  - [x] `components/stats/stats-summary.tsx` 생성
    - [x] 전체 관광지 수 표시
    - [x] Top 3 지역 표시 (카드 형태)
    - [x] Top 3 타입 표시 (카드 형태)
    - [x] 마지막 업데이트 시간 표시
    - [x] 로딩 상태 (Skeleton UI)
    - [x] 카드 레이아웃 디자인
  ***
  추가 개발 사항:
  - [x] 숫자 포맷팅 함수 구현 (formatNumber - 천 단위 구분자)
  - [x] 날짜 포맷팅 함수 구현 (formatDate - 한국어 형식)
  - [x] 백분율 포맷팅 함수 구현 (formatPercentage - 소수점 1자리)
  - [x] 순위 뱃지 컴포넌트 구현 (RankBadge - 1위, 2위, 3위 색상 구분)
  - [x] 시맨틱 HTML 사용 (article, ol, li, time 태그)
  - [x] 접근성 요소 추가 (aria-label, aria-hidden)
  - [x] 반응형 그리드 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 3열)
  - [x] 에러 처리 (ErrorMessage 컴포넌트 사용)
  - [x] app/stats/page.tsx에 StatsSummary 컴포넌트 통합
- [x] 지역별 분포 차트 (Bar Chart)
  - [x] `components/stats/region-chart.tsx` 생성
    - [x] shadcn/ui Chart 컴포넌트 설치 (Bar)
    - [x] recharts 기반 Bar Chart 구현
    - [x] X축: 지역명 (서울, 부산, 제주 등)
    - [x] Y축: 관광지 개수
    - [x] 상위 10개 지역 표시 (또는 전체)
    - [x] 바 클릭 시 해당 지역 목록 페이지로 이동
    - [x] 호버 시 정확한 개수 표시
    - [x] 다크/라이트 모드 지원
    - [x] 반응형 디자인
    - [x] 로딩 상태
    - [x] 접근성 (ARIA 라벨, 키보드 네비게이션)
  ***
  추가 개발 사항:
  - [x] `components/stats/region-chart-client.tsx` 생성 (Client Component, 차트 렌더링)
  - [x] Server Component와 Client Component 분리 (데이터 페칭과 차트 렌더링 분리)
  - [x] 바 클릭 이벤트 핸들러 구현 (useRouter 사용)
  - [x] 커스텀 툴팁 구현 (ChartTooltipContent 사용)
  - [x] 차트 색상 설정 (hsl(var(--chart-1)) 사용)
  - [x] X축 레이블 회전 (45도 각도)
  - [x] Y축 숫자 포맷팅 (천 단위 구분자)
- [x] 타입별 분포 차트 (Donut Chart)
  - [x] `components/stats/type-chart.tsx` 생성
    - [x] shadcn/ui Chart 컴포넌트 설치 (Pie/Donut)
    - [x] recharts 기반 Donut Chart 구현
    - [x] 타입별 비율 (백분율)
    - [x] 타입별 개수 표시
    - [x] 섹션 클릭 시 해당 타입 목록 페이지로 이동
    - [x] 호버 시 타입명, 개수, 비율 표시
    - [x] 다크/라이트 모드 지원
    - [x] 반응형 디자인
    - [x] 로딩 상태
    - [x] 접근성 (ARIA 라벨)
  ***
  추가 개발 사항:
  - [x] `components/stats/type-chart-client.tsx` 생성 (Client Component, Donut Chart 렌더링)
  - [x] Server Component와 Client Component 분리 (데이터 페칭과 차트 렌더링 분리)
  - [x] PieChart, Pie, Cell 컴포넌트 사용 (recharts)
  - [x] Donut Chart 구현 (innerRadius={60}, outerRadius={100})
  - [x] 각 타입별 색상 차별화 (chart-1 ~ chart-5 순환 사용)
  - [x] 섹션 클릭 이벤트 핸들러 구현 (useRouter 사용)
  - [x] 커스텀 툴팁 구현 (타입명, 개수, 비율 표시)
  - [x] 숫자 및 백분율 포맷팅 함수 구현
  - [x] 데이터 정렬 (count 내림차순)
- [x] 페이지 통합
  - [x] `app/stats/page.tsx`에 모든 컴포넌트 통합
    - [x] 통계 요약 카드 (상단)
    - [x] 지역별 분포 차트 (중단)
    - [x] 타입별 분포 차트 (하단)
  - [x] 에러 처리 (에러 메시지 + 재시도 버튼)
  - [x] 네비게이션에 통계 페이지 링크 추가
  - [x] 최종 페이지 확인
  ***
  추가 개발 사항:
  - [x] ErrorMessage 컴포넌트에 `defaultRetry` prop 추가 (onRetry가 없을 때 기본 재시도 버튼 표시)
  - [x] 모든 차트 컴포넌트(StatsSummary, RegionChart, TypeChart)에 `defaultRetry={true}` 추가
  - [x] 재시도 버튼 클릭 시 페이지 새로고침 (`window.location.reload()`)

## Phase 5: 북마크 페이지 (`/bookmarks`) - 선택 사항

- [x] Supabase 설정 확인
  - [x] `bookmarks` 테이블 확인 (db.sql 참고)
    - [x] `users` 테이블과의 관계 확인
    - [x] 인덱스 확인 (user_id, content_id, created_at)
    - [x] RLS 비활성화 확인 (개발 환경)
  ***
  추가 개발 사항:
  - [x] Supabase MCP 도구를 사용한 테이블 구조 상세 확인
  - [x] 외래 키 제약조건 확인 (bookmarks.user_id → users.id, ON DELETE CASCADE)
  - [x] 모든 인덱스 확인 (bookmarks: 5개, users: 2개)
  - [x] 기존 북마크 구현 검증 (actions/bookmarks.ts)
  - [x] Supabase 클라이언트 설정 확인 (server.ts, clerk-client.ts, service-role.ts)
  - [x] Supabase 보안 권고사항 확인 (RLS 비활성화 경고 - 의도된 설정)
  - [x] 검증 스크립트 작성 (scripts/verify-supabase-setup.ts)
  - [x] 확인 결과 문서화 (docs/task/20250101-phase5-supabase-setup-verification.md)
- [ ] 북마크 목록 페이지
  - [ ] `app/bookmarks/page.tsx` 생성
    - [ ] 인증된 사용자만 접근 가능
    - [ ] 로그인하지 않은 경우 로그인 유도
  - [ ] `components/bookmarks/bookmark-list.tsx` 생성
    - [ ] 사용자 북마크 목록 조회 (`getUserBookmarks()`)
    - [ ] 카드 레이아웃 (홈페이지와 동일한 tour-card 사용)
    - [ ] 빈 상태 처리 (북마크 없을 때)
    - [ ] 로딩 상태 (Skeleton UI)
- [ ] 북마크 관리 기능
  - [ ] 정렬 옵션
    - [ ] 최신순 (created_at DESC)
    - [ ] 이름순 (가나다순)
    - [ ] 지역별
  - [ ] 일괄 삭제 기능
    - [ ] 체크박스 선택
    - [ ] 선택 항목 삭제
    - [ ] 확인 다이얼로그
  - [ ] 개별 삭제 기능
    - [ ] 각 카드에 삭제 버튼
- [ ] 페이지 통합 및 스타일링
  - [ ] 반응형 디자인 확인
  - [ ] 최종 페이지 확인

## Phase 6: 최적화 & 배포

- [ ] 이미지 최적화
  - [ ] `next.config.ts` 외부 도메인 설정
    - [ ] 한국관광공사 이미지 도메인 추가
    - [ ] 네이버 지도 이미지 도메인 추가
  - [ ] Next.js Image 컴포넌트 사용 확인
    - [ ] priority 속성 (above-the-fold)
    - [ ] lazy loading (below-the-fold)
    - [ ] responsive sizes 설정
- [ ] 전역 에러 핸들링
  - [ ] `app/error.tsx` 생성
  - [ ] `app/global-error.tsx` 생성
  - [ ] API 에러 처리 개선
- [ ] 404 페이지
  - [ ] `app/not-found.tsx` 생성
    - [ ] 사용자 친화적인 메시지
    - [ ] 홈으로 돌아가기 버튼
- [ ] SEO 최적화
  - [ ] 메타태그 설정 (`app/layout.tsx`)
    - [ ] 기본 title, description
    - [ ] Open Graph 태그
    - [ ] Twitter Card 태그
  - [ ] `app/sitemap.ts` 생성
    - [ ] 동적 sitemap 생성 (관광지 상세페이지 포함)
  - [ ] `app/robots.ts` 생성
- [ ] 성능 최적화
  - [ ] Lighthouse 점수 측정 (목표: > 80)
  - [ ] 코드 분할 확인
  - [ ] 불필요한 번들 제거
  - [ ] API 응답 캐싱 전략 확인
- [ ] 환경변수 보안 검증
  - [ ] 모든 필수 환경변수 확인
  - [ ] `.env.example` 업데이트
  - [ ] 프로덕션 환경변수 설정 가이드 작성
- [ ] 배포 준비
  - [ ] Vercel 배포 설정
  - [ ] 환경변수 설정 (Vercel 대시보드)
  - [ ] 빌드 테스트 (`pnpm build`)
  - [ ] 프로덕션 배포 및 테스트

## 추가 작업 (선택 사항)

- [ ] 다크 모드 지원
  - [ ] 테마 전환 기능
  - [ ] 모든 컴포넌트 다크 모드 스타일 적용
- [ ] PWA 지원
  - [ ] `app/manifest.ts` 생성
  - [ ] Service Worker 설정
  - [ ] 오프라인 지원
- [ ] 접근성 개선
  - [ ] ARIA 라벨 추가
  - [ ] 키보드 네비게이션 개선
  - [ ] 색상 대비 확인 (WCAG AA)
- [ ] 성능 모니터링
  - [ ] Web Vitals 측정
  - [ ] 에러 로깅 (Sentry 등)
- [ ] 사용자 피드백
  - [ ] 피드백 수집 기능
  - [ ] 버그 리포트 기능
