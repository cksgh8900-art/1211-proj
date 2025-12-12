# Phase 6: 이미지 최적화 구현 완료

**작업일**: 2025-01-01  
**Phase**: Phase 6 - 최적화 & 배포  
**작업 항목**: 이미지 최적화

## 구현 내용

### 1. next.config.ts 외부 도메인 설정

#### 1.1 네이버 지도 이미지 도메인 추가
- `oapi.map.naver.com` 도메인 추가
- `map.naver.com` 도메인 추가

#### 1.2 이미지 최적화 설정 추가
- `formats`: `["image/avif", "image/webp"]` - AVIF 및 WebP 포맷 지원
- `deviceSizes`: 다양한 디바이스 크기 지원 (640px ~ 3840px)
- `imageSizes`: 작은 이미지 크기 지원 (16px ~ 384px)

**최종 설정**:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "tong.visitkorea.or.kr" },
      { hostname: "api.visitkorea.or.kr" },
      { hostname: "oapi.map.naver.com" },
      { hostname: "map.naver.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 2. Next.js Image 컴포넌트 최적화

#### 2.1 priority 속성 추가 (Above-the-fold 이미지)

**components/tour-card.tsx**:
- `priority` prop 추가 (기본값: `false`)
- `components/tour-list.tsx`에서 첫 6개 카드에만 `priority={true}` 적용
- `loading="eager"` 속성 추가 (priority가 true일 때)

**components/tour-detail/detail-info.tsx**:
- 이미 `priority` 속성 존재 (확인 완료)
- `loading="eager"` 속성 추가

**components/tour-detail/image-gallery-client.tsx**:
- 첫 번째 이미지에 이미 `priority={index === 0}` 적용됨 (확인 완료)

#### 2.2 sizes 속성 최적화

**components/tour-card.tsx**:
- 기존: `"(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- 최적화: `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- 모바일 기준을 640px로 조정 (더 정확한 반응형 대응)

**components/tour-detail/detail-info.tsx**:
- 기존: `"(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw"`
- 최적화: `"(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 80vw"`
- 데스크톱 기준을 1280px로 조정

**components/tour-detail/image-gallery-client.tsx**:
- 메인 이미지: `"(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"` (유지)
- 썸네일: `"(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"` (유지)

#### 2.3 Lazy Loading 최적화
- priority가 없는 이미지는 기본적으로 lazy loading 적용됨
- 무한 스크롤 시 추가 로드되는 이미지는 자동으로 lazy loading

#### 2.4 Blur Placeholder 추가

**lib/utils/image.ts** 생성:
- `getBlurDataURL()` 함수: 기본 blur placeholder 데이터 URL 반환
- `getImageUrl()` 함수: 이미지 URL 우선순위 처리
- `isValidImageUrl()` 함수: 이미지 URL 유효성 검증
- `getDefaultImageUrl()` 함수: 기본 이미지 URL 반환

**적용된 컴포넌트**:
- `components/tour-card.tsx`: `placeholder="blur"`, `blurDataURL={getBlurDataURL()}`
- `components/tour-detail/detail-info.tsx`: `placeholder="blur"`, `blurDataURL={getBlurDataURL()}`
- `components/tour-detail/image-gallery-client.tsx`: 
  - 메인 이미지 (Swiper 슬라이드)
  - 단일 이미지
  - 썸네일 그리드
- `components/tour-detail/image-modal.tsx`: 전체화면 모달 이미지

## 생성된 파일

1. `lib/utils/image.ts` - 이미지 최적화 유틸리티 함수

## 수정된 파일

1. `next.config.ts` - 네이버 지도 도메인 및 이미지 최적화 설정 추가
2. `components/tour-card.tsx` - priority, blur placeholder, sizes 최적화
3. `components/tour-list.tsx` - TourCard에 priority prop 전달 (첫 6개만)
4. `components/tour-detail/detail-info.tsx` - loading="eager", blur placeholder, sizes 최적화
5. `components/tour-detail/image-gallery-client.tsx` - blur placeholder 추가
6. `components/tour-detail/image-modal.tsx` - blur placeholder 추가
7. `docs/TODO.md` - Phase 6 이미지 최적화 항목 체크 및 추가 개발 사항 기록

## 주요 개선 사항

### 성능 최적화
1. **Priority Loading**: Above-the-fold 이미지 우선 로딩
   - 홈페이지 첫 6개 카드
   - 상세페이지 대표 이미지
   - 이미지 갤러리 첫 번째 이미지

2. **Lazy Loading**: Below-the-fold 이미지 지연 로딩
   - 스크롤 후 표시되는 카드
   - 이미지 갤러리 나머지 이미지

3. **Blur Placeholder**: 레이아웃 시프트 방지
   - 모든 이미지에 blur placeholder 적용
   - 이미지 로딩 전에도 공간 확보

4. **Responsive Sizes**: 적절한 이미지 크기 로드
   - 화면 크기별 최적화된 sizes 속성
   - 불필요한 대용량 이미지 로드 방지

5. **이미지 포맷 최적화**: AVIF 및 WebP 자동 변환
   - Next.js Image 컴포넌트가 자동으로 최적 포맷 선택
   - 네트워크 사용량 감소

## 예상 성능 개선

- **Largest Contentful Paint (LCP)**: priority 속성으로 개선 예상
- **Cumulative Layout Shift (CLS)**: blur placeholder로 개선 예상
- **네트워크 사용량**: 적절한 sizes 및 포맷 최적화로 감소 예상
- **Lighthouse Performance 점수**: 목표 > 80

## 참고 파일

- [next.config.ts](../../next.config.ts) - Next.js 설정 파일
- [components/tour-card.tsx](../../components/tour-card.tsx) - 관광지 카드 컴포넌트
- [components/tour-list.tsx](../../components/tour-list.tsx) - 관광지 목록 컴포넌트
- [components/tour-detail/detail-info.tsx](../../components/tour-detail/detail-info.tsx) - 상세페이지 기본 정보
- [components/tour-detail/image-gallery-client.tsx](../../components/tour-detail/image-gallery-client.tsx) - 이미지 갤러리
- [components/tour-detail/image-modal.tsx](../../components/tour-detail/image-modal.tsx) - 이미지 모달
- [lib/utils/image.ts](../../lib/utils/image.ts) - 이미지 최적화 유틸리티
- [docs/PRD.md](../PRD.md) - 프로젝트 요구사항
- [docs/TODO.md](../TODO.md) - Phase 6 작업 목록

---

**작성자**: AI Assistant  
**작성일**: 2025-01-01

