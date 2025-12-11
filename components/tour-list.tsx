"use client";

/**
 * @file components/tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 주요 기능:
 * 1. 관광지 목록을 그리드 레이아웃으로 표시
 * 2. 로딩 상태 (Skeleton UI)
 * 3. 빈 상태 처리
 * 4. 에러 처리
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard 컴포넌트
 * - components/ui/skeleton.tsx: 스켈레톤 UI
 * - components/ui/error.tsx: 에러 메시지
 * - lib/types/tour.ts: TourItem 타입
 */

import type { TourItem } from "@/lib/types/tour";
import { TourCard } from "./tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourListProps {
  tours: TourItem[];
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
  sort?: "latest" | "name"; // 정렬 옵션 (서버에서 정렬된 경우 전달)
}

/**
 * 기본 재시도 함수
 */
function defaultOnRetry() {
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

/**
 * 스켈레톤 로딩 UI
 */
function TourListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="card" />
      ))}
    </div>
  );
}

/**
 * 빈 상태 UI
 */
function TourListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <MapPin className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">관광지를 찾을 수 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          다른 지역이나 타입을 선택해보세요
        </p>
      </div>
    </div>
  );
}

export function TourList({
  tours,
  loading = false,
  error = null,
  onRetry,
  className,
}: TourListProps) {
  // 로딩 상태
  if (loading) {
    return (
      <div className={className}>
        <TourListSkeleton />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={className}>
        <ErrorMessage
          message={
            error.message ||
            "관광지 목록을 불러오는 중 오류가 발생했습니다."
          }
          type="api"
          onRetry={onRetry || defaultOnRetry}
        />
      </div>
    );
  }

  // 빈 상태
  if (tours.length === 0) {
    return (
      <div className={className}>
        <TourListEmpty />
      </div>
    );
  }

  // 목록 표시
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
      role="list"
      aria-label="관광지 목록"
    >
      {tours.map((tour) => (
        <TourCard key={tour.contentid} tour={tour} />
      ))}
    </div>
  );
}

