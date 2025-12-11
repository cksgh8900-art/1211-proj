/**
 * @file components/tour-detail/detail-map-skeleton.tsx
 * @description 관광지 상세페이지 지도 섹션 Skeleton UI
 *
 * 주요 기능:
 * - 지도 섹션 로딩 중 스켈레톤 UI 표시
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * 지도 섹션 Skeleton 컴포넌트
 */
export function DetailMapSkeleton() {
  return (
    <section
      className="rounded-lg border bg-card p-6 space-y-4"
      aria-label="지도 (로딩 중)"
    >
      {/* 제목 Skeleton */}
      <Skeleton className="h-8 w-24" />

      {/* 지도 컨테이너 Skeleton */}
      <Skeleton className="w-full h-[300px] md:h-[400px] rounded-lg" />

      {/* 버튼 영역 Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </section>
  );
}

