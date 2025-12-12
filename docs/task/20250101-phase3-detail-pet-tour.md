# 반려동물 정보 섹션 개발 (MVP 2.5)

## 작업 일시
2025-01-01

## 작업 개요
Phase 3 상세페이지에 반려동물 동반 여행 정보를 표시하는 섹션을 추가하여 사용자가 반려동물과 함께 여행할 수 있는 관광지 정보를 제공합니다.

## 구현 내용

### 1. 메인 컴포넌트 생성
**파일**: `components/tour-detail/detail-pet-tour.tsx`

- Server Component로 구현
- `getDetailPetTour()` API 호출 (`lib/api/tour-api.ts`)
- `PetTourInfo` 타입 사용 (`lib/types/tour.ts`)
- 기존 `DetailIntro` 컴포넌트와 유사한 구조 및 스타일 적용

**주요 기능**:
- 반려동물 동반 가능 여부 표시 (`chkpetleash`)
- 반려동물 크기 제한 정보 (`chkpetsize`)
- 반려동물 입장 가능 장소 (`chkpetplace` - 실내/실외)
- 반려동물 동반 추가 요금 (`chkpetcharge`)
- 반려동물 전용 시설 정보 (`petinfo`)
- 주차장 정보 (`parking` - 반려동물 하차 공간)
- 추가 정보 (`chkpetetc`)

**UI 구성**:
- 섹션 제목: "반려동물 동반 정보" (🐾 이모지 포함)
- `InfoItem` 컴포넌트 패턴 사용 (기존 `DetailIntro`와 동일)
- 각 정보 항목에 적절한 아이콘 사용 (Heart, Info, Home, DollarSign, Building, Car)
- 정보가 없는 경우 섹션 전체 숨김 처리
- 에러 처리 (ErrorMessage 컴포넌트 사용)

### 2. 스켈레톤 UI 생성
**파일**: `components/tour-detail/detail-pet-tour-skeleton.tsx`

- `DetailIntroSkeleton`과 유사한 구조
- 로딩 상태 표시용 스켈레톤 컴포넌트
- 5개의 정보 항목 스켈레톤 표시

### 3. 상세페이지 통합
**파일**: `app/places/[contentId]/page.tsx`

- `DetailPetTour` 컴포넌트 import
- `DetailPetTourSkeleton` import
- Suspense로 래핑하여 비동기 로딩 처리
- 운영 정보 섹션 다음에 배치 (순서: 기본정보 → 운영정보 → 반려동물정보 → 이미지갤러리 → 지도)

## 구현 세부사항

### 정보 표시 우선순위
1. 반려동물 동반 가능 여부 (`chkpetleash`) - 가장 중요
2. 반려동물 크기 제한 (`chkpetsize`)
3. 입장 가능 장소 (`chkpetplace`)
4. 추가 요금 (`chkpetcharge`)
5. 전용 시설 정보 (`petinfo`)
6. 주차장 정보 (`parking`)
7. 추가 정보 (`chkpetetc`)

### 아이콘 매핑
- 반려동물 동반 가능: `Heart` (lucide-react)
- 크기 제한: `Info`
- 입장 가능 장소: `Home`
- 추가 요금: `DollarSign`
- 전용 시설: `Building`
- 주차장: `Car`
- 추가 정보: `Info`

### 텍스트 포맷팅
- HTML 태그 제거 (`formatText` 함수 사용, `DetailIntro`와 동일)
- 멀티라인 텍스트 지원 (`multiline` prop)
- 정보가 없는 필드는 표시하지 않음

### 에러 처리
- API 호출 실패 시 `ErrorMessage` 컴포넌트 표시
- 데이터가 없는 경우 섹션 전체 숨김 (null 반환)

## 접근성
- `aria-label` 속성 추가 ("반려동물 동반 정보")
- 시맨틱 HTML 사용 (`<section>` 태그)
- 키보드 네비게이션 지원

## 스타일링
- 기존 섹션과 일관된 디자인 (`rounded-lg border bg-card p-6`)
- 반응형 디자인 (모바일 우선)
- 🐾 이모지를 제목에 포함

## 수정 파일
- `components/tour-detail/detail-pet-tour.tsx` (신규 생성)
- `components/tour-detail/detail-pet-tour-skeleton.tsx` (신규 생성)
- `app/places/[contentId]/page.tsx` (수정)
- `docs/TODO.md` (업데이트)

## 검증
- ✅ API 호출 정상 작동 확인
- ✅ 모든 정보 필드 표시 확인
- ✅ 정보가 없는 경우 섹션 숨김 확인
- ✅ 에러 처리 확인
- ✅ 스켈레톤 UI 표시 확인
- ✅ 반응형 디자인 확인
- ✅ 접근성 확인 (ARIA 라벨, 시맨틱 HTML)
- ✅ 린터 오류 없음

