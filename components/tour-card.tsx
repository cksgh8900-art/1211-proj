"use client";

/**
 * @file components/tour-card.tsx
 * @description 관광지 카드 컴포넌트
 *
 * 주요 기능:
 * 1. 관광지 정보 카드 형태로 표시
 * 2. 썸네일 이미지, 관광지명, 주소, 타입 뱃지 표시
 * 3. 호버 효과 및 클릭 시 상세페이지 이동
 *
 * @dependencies
 * - next/image: 이미지 최적화
 * - next/link: 라우팅
 * - lib/types/tour.ts: TourItem 타입
 * - lib/types/stats.ts: CONTENT_TYPE_NAME, AREA_CODE_NAME 상수
 */

import Image from "next/image";
import Link from "next/link";
import type { TourItem } from "@/lib/types/tour";
import { CONTENT_TYPE_NAME, AREA_CODE_NAME } from "@/lib/types/stats";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlurDataURL } from "@/lib/utils/image";

interface TourCardProps {
  tour: TourItem;
  className?: string;
  selected?: boolean;
  onCardClick?: (tour: TourItem) => void;
  onCardHover?: (tour: TourItem | null) => void;
  priority?: boolean; // Above-the-fold 이미지에 priority 적용
}

/**
 * 이미지 URL을 반환 (우선순위: firstimage > firstimage2 > 기본 이미지)
 */
function getImageUrl(tour: TourItem): string {
  if (tour.firstimage) return tour.firstimage;
  if (tour.firstimage2) return tour.firstimage2;
  // 기본 이미지는 나중에 추가 가능
  return "/images/placeholder-tour.jpg";
}

/**
 * 관광 타입명을 반환
 */
function getContentTypeName(contentTypeId: string): string {
  return CONTENT_TYPE_NAME[contentTypeId] || "기타";
}

/**
 * 지역명을 반환
 */
function getAreaName(areaCode: string): string {
  return AREA_CODE_NAME[areaCode] || "";
}

export function TourCard({
  tour,
  className,
  selected = false,
  onCardClick,
  onCardHover,
  priority = false,
}: TourCardProps) {
  const imageUrl = getImageUrl(tour);
  const contentTypeName = getContentTypeName(tour.contenttypeid);
  const areaName = getAreaName(tour.areacode);
  const fullAddress = tour.addr2
    ? `${tour.addr1} ${tour.addr2}`
    : tour.addr1;

  const handleClick = (e: React.MouseEvent) => {
    // 지도 이동이 우선이므로 기본 링크 동작 방지
    if (onCardClick) {
      e.preventDefault();
      onCardClick(tour);
    }
  };

  const handleMouseEnter = () => {
    if (onCardHover) {
      onCardHover(tour);
    }
  };

  const handleMouseLeave = () => {
    if (onCardHover) {
      onCardHover(null);
    }
  };

  return (
    <Link
      href={`/places/${tour.contentid}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "ring-2 ring-primary ring-offset-2",
        className
      )}
      aria-label={`${tour.title} 상세보기`}
    >
      {/* 썸네일 이미지 */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
        {imageUrl.startsWith("http") ? (
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL={getBlurDataURL()}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <MapPin className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* 카드 본문 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* 관광 타입 뱃지 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {contentTypeName}
          </span>
          {areaName && (
            <span className="text-xs text-muted-foreground">{areaName}</span>
          )}
        </div>

        {/* 관광지명 */}
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary">
          {tour.title}
        </h3>

        {/* 주소 */}
        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="line-clamp-2">{fullAddress}</span>
        </div>
      </div>
    </Link>
  );
}

