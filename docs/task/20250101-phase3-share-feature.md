# Phase 3: 공유 기능 (MVP 2.4.5) 구현 완료

## 작업 개요

상세페이지 (`/places/[contentId]`)에 URL 복사 기능과 Open Graph 메타태그를 추가하여 사용자가 관광지 정보를 쉽게 공유할 수 있도록 하고, SEO를 최적화했습니다.

## 구현된 파일

### 1. `components/tour-detail/share-button.tsx`
- **타입**: Client Component ("use client")
- **기능**:
  - 현재 페이지 URL을 클립보드에 복사 (`navigator.clipboard.writeText()`)
  - 복사 완료 토스트 메시지 표시 (`showToast.success()`)
  - 공유 아이콘 버튼 (Share2 아이콘)
  - 복사 상태 표시 (복사 전: Share2, 복사 후: Check)
- **UI/UX**:
  - 버튼 스타일: `outline` variant
  - 반응형: 모바일에서 텍스트 숨김 (`hidden sm:inline`)
  - 접근성: `aria-label` 추가
- **에러 처리**: 클립보드 API 실패 시 에러 토스트 메시지

### 2. `app/places/[contentId]/page.tsx`
- **변경 사항**:
  - `generateMetadata` 함수 추가 (동적 메타데이터 생성)
  - `ShareButton` 컴포넌트 import 및 통합
  - ShareButton을 뒤로가기 버튼 옆에 배치
- **메타데이터 생성**:
  - `getDetailCommon` API로 관광지 정보 조회
  - Open Graph 메타태그 생성
  - Twitter Card 메타태그 생성

## 주요 기능

### 1. URL 복사 기능
- ShareButton 클릭 시 현재 페이지 URL 복사
- 복사 완료 토스트 메시지 표시
- 복사 상태 UI 피드백 (아이콘 변경)

### 2. Open Graph 메타태그
- **og:title**: 관광지명 (`detail.title`)
- **og:description**: 관광지 설명 (`detail.overview`에서 100자 이내, HTML 태그 제거)
- **og:image**: 대표 이미지 (`detail.firstimage` 또는 `detail.firstimage2`, 1200x630)
- **og:url**: 상세페이지 URL (`/places/[contentId]`)
- **og:type**: "website"
- **og:locale**: "ko_KR"
- **og:siteName**: "My Trip"

### 3. Twitter Card 메타태그
- **twitter:card**: "summary_large_image"
- **twitter:title**: 관광지명
- **twitter:description**: 관광지 설명
- **twitter:images**: 대표 이미지

## 기술적 세부사항

### 클립보드 API
- `navigator.clipboard.writeText()` 사용
- HTTPS 환경 또는 localhost에서만 동작
- 에러 처리: 실패 시 에러 토스트 메시지

### URL 생성
- 클라이언트 사이드: `window.location.origin` 사용
- 서버 사이드 (메타데이터): `process.env.NEXT_PUBLIC_SITE_URL` 또는 기본값 사용

### 메타데이터 생성
- Next.js 15의 `generateMetadata` 함수 사용
- `params`는 Promise로 제공됨 (Next.js 15 규칙)
- Server Component에서만 사용 가능
- `getDetailCommon` API를 사용하여 관광지 정보 조회

### HTML 태그 제거
- `stripHtmlTags` 함수 구현
- 정규식으로 HTML 태그 제거: `replace(/<[^>]*>/g, "")`
- 공백 정규화: `replace(/\s+/g, " ")`

### 설명 텍스트 처리
- `detail.overview`에서 HTML 태그 제거
- 100자 이내로 제한 (`substring(0, 100)`)
- 100자 초과 시 "..." 추가
- 없으면 기본 설명 사용: `${detail.title} - 한국 관광지 정보`

### 이미지 처리
- `detail.firstimage` 우선 사용
- 없으면 `detail.firstimage2` 사용
- 둘 다 없으면 `og:image` 생략
- 이미지 크기 정보 제공 (width: 1200, height: 630)

## 에러 처리

### ShareButton
- 클립보드 API 실패 시 에러 토스트 메시지
- 콘솔 에러 로깅

### generateMetadata
- API 호출 실패 시 기본 메타데이터 반환
- 이미지 없음 처리
- 설명 없음 처리
- contentId 검증 실패 시 기본 메타데이터 반환

## UI/UX

### ShareButton 위치
- 상세페이지 헤더 영역 (뒤로가기 버튼 옆)
- `flex items-center justify-between` 레이아웃

### 반응형 디자인
- 모바일: 아이콘만 표시 (텍스트 숨김)
- 데스크톱: 아이콘 + 텍스트 표시

### 접근성
- `aria-label` 추가: "링크 복사" 또는 "링크가 복사되었습니다"
- 키보드 네비게이션 지원
- 복사 상태에 대한 피드백 (토스트 메시지)

## 테스트 확인 사항

1. ✅ ShareButton 클릭 시 URL이 클립보드에 복사되는지 확인
2. ✅ 복사 완료 토스트 메시지가 표시되는지 확인
3. ✅ 복사 후 아이콘 변경 (Share2 → Check) 확인
4. ✅ Open Graph 메타태그가 정상 생성되는지 확인 (소셜 미디어 공유 테스트)
5. ✅ 이미지가 없는 경우 메타데이터 처리 확인
6. ✅ 설명이 없는 경우 메타데이터 처리 확인
7. ✅ 반응형 디자인 확인 (모바일/데스크톱)
8. ✅ HTML 태그가 제거된 description 확인

## 관련 파일

- `components/tour-detail/share-button.tsx`
- `app/places/[contentId]/page.tsx`
- `lib/utils/toast.ts` (기존 파일, `showToast` 함수)
- `lib/api/tour-api.ts` (기존 파일, `getDetailCommon` 함수)
- `lib/types/tour.ts` (기존 파일, `TourDetail` 타입)

