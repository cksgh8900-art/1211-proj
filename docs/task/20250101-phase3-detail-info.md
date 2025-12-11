# 작업 완료: Phase 3 기본 정보 섹션

**작업 일시**: 2025-01-01  
**Phase**: Phase 3 - 상세페이지 (`/places/[contentId]`)  
**작업 항목**: 기본 정보 섹션 (MVP 2.4.1)

## 작업 내용

### 1. 기본 정보 컴포넌트 생성

**파일**: `components/tour-detail/detail-info.tsx`

**구현 사항**:
- Server Component로 구현 (async 함수)
- `getDetailCommon()` API 연동
- `TourDetail` 타입 사용
- 에러 처리 (try-catch, ErrorMessage 컴포넌트 사용)

### 2. UI 요소 구현

#### 2.1 관광지명 (대제목)
- `title` 필드 사용
- 큰 제목 스타일: `text-3xl md:text-4xl font-bold`
- 모바일에서 반응형 크기 조정

#### 2.2 대표 이미지 (크게 표시)
- `firstimage` 우선, 없으면 `firstimage2`
- 둘 다 없으면 표시하지 않음
- Next.js `Image` 컴포넌트 사용 (최적화)
- aspect ratio: 고정 높이 (모바일: 256px, 데스크톱: 384px)
- `priority` 속성 적용 (above-the-fold)

#### 2.3 주소 표시 및 복사 기능
- `addr1` + `addr2` 조합하여 표시
- `CopyAddressButton` 컴포넌트 사용 (별도 파일)
- 클립보드 API 사용 (`navigator.clipboard.writeText()`)
- 복사 완료 토스트 메시지 (`showToast.success()`)
- 복사 상태 표시 (체크 아이콘, "복사됨" 텍스트)

#### 2.4 전화번호 (클릭 시 전화 연결)
- `tel` 필드 사용
- `tel:` 프로토콜 링크 (`<a href="tel:{전화번호}">`)
- Phone 아이콘 사용
- 클릭 시 모바일에서 전화 앱 실행

#### 2.5 홈페이지 (링크)
- `homepage` 필드 사용
- 외부 링크로 표시 (`target="_blank" rel="noopener noreferrer"`)
- ExternalLink 아이콘 사용
- URL 정규화 함수 구현 (`formatHomepageUrl`):
  - `http://` 또는 `https://`가 없으면 자동으로 `https://` 추가

#### 2.6 개요 (긴 설명문)
- `overview` 필드 사용
- HTML 태그 제거 함수 구현 (`formatOverview`)
- 줄바꿈 처리 (`whitespace-pre-wrap`)
- prose 클래스 사용 (가독성 향상)

#### 2.7 관광 타입 및 카테고리 뱃지
- 관광 타입: `CONTENT_TYPE_NAME[contenttypeid]` 사용
- 카테고리: `cat1name`, `cat2name`, `cat3name` 표시 (있는 경우)
- 지역: `AREA_CODE_NAME[areacode]` 사용 (MapPin 아이콘과 함께)
- 뱃지 스타일: `bg-primary/10 text-primary`

### 3. 정보 없는 항목 숨김 처리

- 각 항목별로 조건부 렌더링 구현
- 주소: `{fullAddress && ...}`
- 전화번호: `{detail.tel && ...}`
- 홈페이지: `{homepageUrl && ...}`
- 개요: `{overview && ...}`
- 이미지: `{imageUrl && ...}`

### 4. 페이지 통합

**파일**: `app/places/[contentId]/page.tsx`

- `DetailInfo` 컴포넌트 import 및 사용
- `Suspense` boundary로 감싸기 (`DetailInfoSkeleton` fallback)
- 임시 콘텐츠 제거

### 5. 로딩 상태

**파일**: `components/tour-detail/detail-info-skeleton.tsx`

- `Skeleton` 컴포넌트 사용
- 제목, 이미지, 정보 영역별 스켈레톤 UI
- 실제 레이아웃과 유사한 구조

### 6. 주소 복사 버튼

**파일**: `components/tour-detail/copy-address-button.tsx`

**구현 사항**:
- Client Component로 구현 (useState 사용)
- 클립보드 API 사용
- 복사 상태 표시 (복사 전: Copy 아이콘, 복사 후: Check 아이콘)
- 2초 후 복사 상태 초기화
- 에러 처리 (토스트 메시지)

## 변경된 파일

1. `components/tour-detail/detail-info.tsx` (새로 생성)
2. `components/tour-detail/copy-address-button.tsx` (새로 생성)
3. `components/tour-detail/detail-info-skeleton.tsx` (새로 생성)
4. `app/places/[contentId]/page.tsx` (수정)

## 주요 구현 특징

### 1. 클립보드 API 사용
- HTTPS 환경 또는 localhost에서만 동작
- 에러 처리 및 사용자 피드백 제공
- 복사 상태 시각적 표시

### 2. 전화번호 링크
- `tel:` 프로토콜 사용
- 모바일에서 자동으로 전화 앱 실행
- 접근성: `aria-label` 추가

### 3. 홈페이지 URL 정규화
- `http://` 또는 `https://`가 없으면 자동으로 `https://` 추가
- 보안: `rel="noopener noreferrer"` 추가

### 4. 개요 텍스트 처리
- HTML 태그 제거
- 줄바꿈 유지 (`whitespace-pre-wrap`)
- 긴 텍스트도 가독성 있게 표시

### 5. 접근성
- 시맨틱 HTML 사용 (`<section>`, `<h1>`, `<h2>`)
- `aria-label` 속성 추가
- 키보드 네비게이션 지원 (기본 HTML 요소 사용)

## 테스트 확인 사항

- [ ] API 호출 성공 시 모든 정보 표시 확인
- [ ] 주소 복사 버튼 클릭 시 클립보드 복사 및 토스트 표시
- [ ] 전화번호 클릭 시 모바일에서 전화 앱 실행 (또는 데스크톱에서 전화 프로토콜 처리)
- [ ] 홈페이지 링크 클릭 시 새 탭에서 열림
- [ ] 정보 없는 항목이 숨김 처리되는지 확인
- [ ] 로딩 상태 스켈레톤 UI 표시 확인
- [ ] API 에러 시 에러 메시지 표시 확인
- [ ] 반응형 디자인 확인 (모바일/데스크톱)
- [ ] 이미지가 없을 때 이미지 영역이 표시되지 않는지 확인

## 참고 사항

- `getDetailCommon()` 함수는 이미 `lib/api/tour-api.ts`에 구현되어 있음
- `TourDetail` 타입은 `lib/types/tour.ts`에 정의되어 있음
- Toast는 `lib/utils/toast.ts`의 `showToast` 헬퍼 사용
- `CONTENT_TYPE_NAME`, `AREA_CODE_NAME` 상수는 `lib/types/stats.ts`에 정의되어 있음
- 기존 `TourCard` 컴포넌트에서 이미지 처리 로직 참고
- PRD와 design.md의 레이아웃 구조 참고
- 모바일 우선 반응형 디자인 적용

