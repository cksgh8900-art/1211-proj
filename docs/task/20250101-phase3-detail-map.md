# Phase 3: 지도 섹션 (MVP 2.4.4) 구현 완료

## 작업 개요

상세페이지 (`/places/[contentId]`)에 해당 관광지의 위치를 네이버 지도에 표시하는 지도 섹션을 구현했습니다.

## 구현된 파일

### 1. `components/tour-detail/detail-map.tsx`
- **타입**: Server Component
- **기능**:
  - `contentId`를 받아 `getDetailCommon()` API로 관광지 정보 조회
  - 좌표 정보 (`mapx`, `mapy`) 검증
  - 좌표가 없으면 섹션 숨김 (`null` 반환)
  - Client Component에 데이터 전달
- **에러 처리**: API 에러 시 `ErrorMessage` 컴포넌트 표시

### 2. `components/tour-detail/detail-map-client.tsx`
- **타입**: Client Component
- **기능**:
  - Naver Maps API v3를 사용한 지도 초기화
  - 단일 마커 표시 (관광지 위치)
  - 좌표 변환 (`convertKATECToWGS84` 사용)
  - 지도 중심을 마커 위치로 설정 (줌 레벨: 16)
  - 길찾기 버튼 (네이버 지도 웹 연동)
  - 좌표 정보 표시/숨김 토글 기능
  - 좌표 복사 기능
- **UI/UX**:
  - 지도 높이: 모바일 300px, 데스크톱 400px
  - 반응형 버튼 레이아웃 (모바일: 세로, 데스크톱: 가로)
  - 접근성: ARIA 라벨 추가

### 3. `components/tour-detail/detail-map-skeleton.tsx`
- **타입**: Server Component
- **기능**:
  - 지도 섹션 로딩 중 스켈레톤 UI 표시
  - 제목, 지도 컨테이너, 버튼 영역에 대한 Skeleton

### 4. `app/places/[contentId]/page.tsx`
- **변경 사항**:
  - `DetailMap` 컴포넌트 import 추가
  - `DetailMapSkeleton` 컴포넌트 import 추가
  - 이미지 갤러리 다음에 지도 섹션 추가
  - `Suspense`로 감싸서 로딩 상태 처리

## 주요 기능

### 1. 지도 표시
- 네이버 지도 API v3를 사용하여 단일 관광지 위치 표시
- 마커 1개 표시 (관광지 위치)
- 지도 중심을 마커 위치로 자동 설정 (줌 레벨: 16)

### 2. 길찾기 버튼
- 네이버 지도 웹으로 연결
- URL 형식: `https://map.naver.com/v5/directions/{lat},{lng},,PLACE_POI`
- 새 탭에서 열기 (`target="_blank"`)

### 3. 좌표 정보 표시 (선택 사항)
- 토글 버튼으로 좌표 정보 표시/숨김
- 표시 형식: `위도: {lat}, 경도: {lng}`
- 좌표 복사 기능 (Copy 버튼)

### 4. 에러 처리
- 좌표가 없으면 섹션 숨김
- 네이버 지도 API 로드 실패 시 에러 메시지 표시
- 좌표 변환 실패 시 에러 메시지 표시

## 기술적 세부사항

### 좌표 처리
- `lib/utils/coordinate.ts`의 `convertKATECToWGS84()` 함수 사용
- KATEC 좌표계를 WGS84 좌표계로 변환 (10000000으로 나누기)
- 좌표 유효성 검사 (NaN 체크, 범위 체크)

### 네이버 지도 API
- 전역 `naver.maps` 객체 사용 (이미 `app/layout.tsx`에서 스크립트 로드)
- 지도 초기화: `new naver.maps.Map()`
- 마커 생성: `new naver.maps.Marker()`
- 타입 선언: 기존 `components/naver-map.tsx`와 동일한 패턴 사용

### 접근성
- 섹션에 `aria-label="지도"` 추가
- 버튼에 적절한 `aria-label` 추가
- 지도 컨테이너에 `aria-label="관광지 위치 지도"` 추가

## 추가 개발 사항

다음 기능들이 추가로 구현되었습니다:

1. **좌표 복사 기능**: 좌표 정보 영역에 Copy 버튼 추가
2. **좌표 정보 토글**: 버튼 클릭으로 좌표 정보 표시/숨김
3. **향상된 에러 처리**: 네이버 지도 API 로드 실패, 좌표 변환 실패 등 다양한 에러 상황 처리
4. **로딩 상태 개선**: 좌표 변환 중에도 로딩 상태 표시

## 테스트 확인 사항

1. ✅ 지도가 정상적으로 표시되는지 확인
2. ✅ 마커가 관광지 위치에 정확히 표시되는지 확인
3. ✅ 길찾기 버튼 클릭 시 네이버 지도가 새 탭에서 열리는지 확인
4. ✅ 좌표 정보 토글이 정상 작동하는지 확인
5. ✅ 좌표 복사 기능이 정상 작동하는지 확인
6. ✅ 좌표가 없는 관광지에서 섹션이 숨김 처리되는지 확인
7. ✅ 반응형 디자인 (모바일/데스크톱) 확인
8. ✅ 로딩 상태 (Skeleton UI) 확인
9. ✅ 에러 처리 확인

## 관련 파일

- `components/tour-detail/detail-map.tsx`
- `components/tour-detail/detail-map-client.tsx`
- `components/tour-detail/detail-map-skeleton.tsx`
- `app/places/[contentId]/page.tsx`
- `lib/utils/coordinate.ts` (기존 파일, 좌표 변환 유틸리티)
- `lib/api/tour-api.ts` (기존 파일, `getDetailCommon` 함수)

