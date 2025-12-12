/**
 * @file components/tour-detail/image-modal.tsx
 * @description 이미지 전체화면 모달 컴포넌트
 *
 * 주요 기능:
 * 1. 전체화면 이미지 모달 표시
 * 2. Swiper를 사용한 이미지 슬라이드
 * 3. 키보드 네비게이션 (좌우 화살표, ESC)
 * 4. 이미지 인덱스 표시
 *
 * @dependencies
 * - swiper/react: Swiper 컴포넌트
 * - components/ui/dialog.tsx: Dialog 컴포넌트
 * - lib/types/tour.ts: TourImage 타입
 * - next/image: Image 컴포넌트
 * - lucide-react: X, ChevronLeft, ChevronRight 아이콘
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { TourImage } from "@/lib/types/tour";
import { getBlurDataURL } from "@/lib/utils/image";

interface ImageModalProps {
  images: TourImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 이미지 전체화면 모달 컴포넌트
 */
export function ImageModal({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageModalProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 모달이 열릴 때 초기 인덱스로 이동
  useEffect(() => {
    if (isOpen && swiper && initialIndex >= 0) {
      swiper.slideTo(initialIndex);
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, swiper, initialIndex]);

  // 키보드 이벤트 처리
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && swiper) {
        swiper.slidePrev();
      } else if (e.key === "ArrowRight" && swiper) {
        swiper.slideNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, swiper, onClose]);

  if (images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[100vw] max-h-[100vh] w-full h-full m-0 p-0 gap-0 bg-black/95 border-none rounded-none"
        aria-label="이미지 갤러리"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="닫기"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* 이미지 인덱스 표시 */}
        <div className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Swiper 이미지 슬라이더 */}
        <div className="w-full h-full flex items-center justify-center">
          <Swiper
            onSwiper={setSwiper}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            modules={[Navigation, Keyboard, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            keyboard={{
              enabled: true,
            }}
            pagination={{
              clickable: true,
            }}
            initialSlide={initialIndex}
            spaceBetween={20}
            className="w-full h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={`${image.contentid}-${image.serialnum}-${index}`}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={image.originimgurl}
                    alt={image.imgname || `관광지 이미지 ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority={index === initialIndex}
                    placeholder="blur"
                    blurDataURL={getBlurDataURL()}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 커스텀 네비게이션 버튼 */}
          {images.length > 1 && (
            <>
              <button
                className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

