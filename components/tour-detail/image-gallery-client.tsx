/**
 * @file components/tour-detail/image-gallery-client.tsx
 * @description 이미지 갤러리 클라이언트 컴포넌트
 *
 * 주요 기능:
 * 1. Swiper를 사용한 메인 이미지 슬라이드
 * 2. 썸네일 그리드 표시
 * 3. 썸네일 클릭 시 해당 이미지로 이동
 * 4. 이미지 클릭 시 전체화면 모달 열기
 *
 * @dependencies
 * - swiper/react: Swiper 컴포넌트
 * - components/tour-detail/image-modal.tsx: ImageModal
 * - lib/types/tour.ts: TourImage
 * - next/image: Image 컴포넌트
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import type { TourImage } from "@/lib/types/tour";
import { ImageModal } from "./image-modal";
import { getBlurDataURL } from "@/lib/utils/image";

interface ImageGalleryClientProps {
  images: TourImage[];
}

/**
 * 이미지 갤러리 클라이언트 컴포넌트
 */
export function ImageGalleryClient({ images }: ImageGalleryClientProps) {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  // 메인 슬라이더 변경 핸들러
  const handleMainSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex);
  };

  const handleThumbnailClick = (index: number) => {
    if (mainSwiper) {
      mainSwiper.slideTo(index);
    }
  };

  const handleImageClick = (index: number) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  if (images.length === 0) return null;

  // 메인 이미지와 썸네일 이미지 분리
  const mainImage = images[0];
  const thumbnailImages = images.slice(1);

  return (
    <div className="space-y-4">
      {/* 메인 이미지 영역 */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer group">
        {images.length > 1 ? (
          <Swiper
            onSwiper={setMainSwiper}
            onSlideChange={handleMainSlideChange}
            spaceBetween={10}
            className="w-full h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={`${image.contentid}-${image.serialnum}-${index}`}>
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => handleImageClick(index)}
                >
                <Image
                  src={image.originimgurl}
                  alt={image.imgname || `관광지 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority={index === 0}
                  placeholder="blur"
                  blurDataURL={getBlurDataURL()}
                />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div
            className="relative w-full h-full"
            onClick={() => handleImageClick(0)}
          >
            <Image
              src={mainImage.originimgurl}
              alt={mainImage.imgname || "관광지 이미지"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
            />
          </div>
        )}

        {/* 이미지 인덱스 표시 (이미지가 여러 개일 때) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm pointer-events-none">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* 클릭 힌트 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium px-4 py-2 rounded-full bg-black/50 transition-opacity">
            클릭하여 전체화면 보기
          </span>
        </div>
      </div>

      {/* 썸네일 그리드 */}
      {thumbnailImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {thumbnailImages.map((image, index) => {
            const actualIndex = index + 1; // 메인 이미지 다음부터
            return (
              <button
                key={`${image.contentid}-${image.serialnum}-${index}`}
                onClick={() => handleThumbnailClick(actualIndex)}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted hover:ring-2 ring-primary transition-all cursor-pointer"
                aria-label={`이미지 ${actualIndex + 1} 보기`}
              >
                <Image
                  src={image.smallimageurl || image.originimgurl}
                  alt={image.imgname || `관광지 이미지 ${actualIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  placeholder="blur"
                  blurDataURL={getBlurDataURL()}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 전체화면 모달 */}
      <ImageModal
        images={images}
        initialIndex={modalInitialIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

