/**
 * @file components/tour-detail/detail-gallery.tsx
 * @description 관광지 이미지 갤러리 섹션 컴포넌트
 *
 * 주요 기능:
 * 1. detailImage2 API를 통한 이미지 목록 표시
 * 2. Swiper를 사용한 메인 이미지 슬라이드
 * 3. 썸네일 그리드 표시
 * 4. 이미지 클릭 시 전체화면 모달 열기
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailImage
 * - lib/types/tour.ts: TourImage
 * - components/tour-detail/image-modal.tsx: ImageModal
 * - components/ui/error.tsx: ErrorMessage
 * - next/image: Image 컴포넌트
 * - swiper/react: Swiper 컴포넌트
 */

import { getDetailImage } from "@/lib/api/tour-api";
import type { TourImage } from "@/lib/types/tour";
import { ErrorMessage } from "@/components/ui/error";
import { ImageGalleryClient } from "./image-gallery-client";

interface DetailGalleryProps {
  contentId: string;
}

/**
 * 이미지 정렬 및 필터링
 */
function processImages(images: TourImage[]): TourImage[] {
  return images
    .filter((img) => img.originimgurl) // 유효한 이미지만
    .sort((a, b) => {
      const numA = parseInt(a.serialnum) || 0;
      const numB = parseInt(b.serialnum) || 0;
      return numA - numB; // serialnum 기준 오름차순
    });
}

/**
 * 이미지 갤러리 섹션 컴포넌트 (Server Component)
 */
export async function DetailGallery({ contentId }: DetailGalleryProps) {
  try {
    const images = await getDetailImage({ contentId });
    const processedImages = processImages(images);

    // 이미지가 없으면 섹션 숨김
    if (processedImages.length === 0) {
      return null;
    }

    return (
      <section
        className="rounded-lg border bg-card p-6 space-y-4"
        aria-label="이미지 갤러리"
      >
        <h2 className="text-2xl font-bold mb-4">이미지 갤러리</h2>
        <ImageGalleryClient images={processedImages} />
      </section>
    );
  } catch (error) {
    console.error("관광지 이미지 로드 실패:", error);
    return (
      <section className="rounded-lg border bg-card p-6">
        <ErrorMessage
          title="이미지를 불러올 수 없습니다"
          message={
            error instanceof Error
              ? error.message
              : "관광지 이미지를 불러오는 중 오류가 발생했습니다."
          }
          type="api"
        />
      </section>
    );
  }
}

