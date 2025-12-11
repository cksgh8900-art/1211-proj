# 네이버 지도 연동 구현 완료

**작업일**: 2025-01-11  
**Phase**: Phase 2 - 홈페이지 (`/`) - 관광지 목록  
**작업 항목**: 네이버 지도 연동 (MVP 2.2)

## 구현 내용

### 1. 좌표 변환 유틸리티 (`lib/utils/coordinate.ts`)

- **KATEC → WGS84 변환 함수**: `convertKATECToWGS84()`
  - 한국관광공사 API의 KATEC 좌표계를 네이버 지도 WGS84 좌표계로 변환
  - `mapx/mapy`를 `10000000`으로 나누어 변환
  - 타입 안전성 및 유효성 검사 포함

- **중심 좌표 계산 함수**: `calculateCenter()`
  - 여러 관광지의 경계 박스를 계산하여 중심 좌표 반환
  - 잘못된 좌표 필터링 처리

### 2. Naver Maps API 스크립트 로드 (`app/layout.tsx`)

- Next.js `next/script` 컴포넌트 사용
- 환경변수 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 사용
- PRD 요구사항: URL 파라미터 `ncpKeyId` 사용 (구 `ncpClientId` 아님)
- `strategy="lazyOnload"`로 성능 최적화

### 3. NaverMap 컴포넌트 (`components/naver-map.tsx`)

**주요 기능**:
- Naver Maps API 초기화 및 지도 표시
- 관광지 목록을 마커로 표시
- 마커 클릭 시 인포윈도우 표시 (관광지명, 주소, "상세보기" 버튼)
- 선택된 관광지로 지도 이동 및 인포윈도우 자동 열기
- 로딩 상태 및 에러 처리

**구현 세부사항**:
- Client Component (`"use client"`)
- `useEffect`로 지도 초기화 및 마커 관리
- 마커 배열을 `useRef`로 관리하여 메모리 누수 방지
- 관광지 중심 좌표 계산 및 `fitBounds`로 전체 관광지 보이기
- TypeScript 타입 선언 (전역 `naver` 객체)

### 4. ListMapView 컴포넌트 (`components/list-map-view.tsx`)

**주요 기능**:
- 리스트와 지도를 함께 관리하는 통합 컴포넌트
- 지도-리스트 연동 상태 관리 (URL 쿼리 파라미터 사용)
- 반응형 레이아웃: 데스크톱(분할), 모바일(탭 전환)

**구현 세부사항**:
- `selectedId` 쿼리 파라미터로 선택된 관광지 관리
- 모바일: `view` 쿼리 파라미터로 리스트/지도 전환
- 마커 클릭 시 URL 업데이트 및 상태 동기화
- Suspense로 `useSearchParams` 래핑

### 5. 지도 컨트롤

- **줌 인/아웃**: 네이버 지도 기본 컨트롤 사용
- **지도 유형 선택**: 일반/스카이뷰 전환 (우측 상단)
- **현재 위치 버튼**: 선택 사항 (미구현)

### 6. 반응형 레이아웃

- **데스크톱 (lg 이상)**: 리스트(좌측 50%) + 지도(우측 50%) 분할
- **모바일 (lg 미만)**: 탭 형태로 리스트/지도 전환
- 지도 최소 높이: 400px (모바일), 600px (데스크톱)

## 파일 변경 사항

### 새로 생성된 파일
- `lib/utils/coordinate.ts`: 좌표 변환 유틸리티
- `components/naver-map.tsx`: 네이버 지도 컴포넌트
- `components/list-map-view.tsx`: 리스트-지도 통합 컴포넌트

### 수정된 파일
- `app/layout.tsx`: Naver Maps API 스크립트 추가
- `app/page.tsx`: ListMapView 컴포넌트 통합

## 기술적 구현 사항

### Naver Maps API 타입 정의
- TypeScript를 위한 전역 `naver` 객체 타입 선언
- Map, Marker, InfoWindow, LatLng, LatLngBounds 등 타입 정의
- 일부 타입은 `any`를 사용하여 유연성 확보

### 상태 관리
- URL 쿼리 파라미터로 상태 관리 (`selectedId`, `view`)
- 클라이언트 사이드 상태와 URL 동기화

### 성능 최적화
- 지도 스크립트 `lazyOnload` 전략
- 마커 이벤트 리스너 정리 (메모리 누수 방지)
- 관광지 목록 변경 시 기존 마커 제거 후 재생성

### 에러 처리
- Naver Maps API 로드 실패 처리
- 좌표 변환 실패 처리
- 지도 초기화 실패 처리
- 사용자 친화적인 에러 메시지 표시

## 남은 작업 (선택 사항)

1. **관광 타입별 마커 색상 구분**: 현재 기본 마커 사용, 타입별 색상 추가 가능
2. **리스트 항목 클릭 → 지도 이동**: TourCard 클릭 시 지도로 이동하는 기능 (현재는 상세페이지로 이동)
3. **리스트 항목 호버 → 마커 강조**: 호버 시 마커 색상 변경 또는 애니메이션
4. **현재 위치 버튼**: 브라우저 Geolocation API 사용

## 참고 사항

- Naver Maps API 문서: https://navermaps.github.io/maps.js.ncp/docs/
- 환경변수 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 필수
- 좌표 변환: KATEC → WGS84 (10000000으로 나눔)
- 클러스터링 모듈은 현재 미지원 (PRD 명시)
- 월 10,000,000건 무료 (NCP)

## 테스트 체크리스트

- [ ] 지도가 정상적으로 표시되는지 확인
- [ ] 관광지 목록이 마커로 표시되는지 확인
- [ ] 마커 클릭 시 인포윈도우가 표시되는지 확인
- [ ] 인포윈도우의 "상세보기" 버튼이 동작하는지 확인
- [ ] 선택된 관광지로 지도가 이동하는지 확인 (URL `selectedId` 파라미터)
- [ ] 모바일에서 탭 전환이 동작하는지 확인
- [ ] 데스크톱에서 리스트와 지도가 분할되어 표시되는지 확인
- [ ] 지도 컨트롤 (줌, 지도 유형 선택)이 동작하는지 확인
- [ ] 에러 상태 (API 로드 실패 등)가 적절히 처리되는지 확인

