/**
 * @file components/tour-detail/detail-info-skeleton.tsx
 * @description 기본 정보 섹션 스켈레톤 UI
 *
 * 로딩 상태 표시용 스켈레톤 컴포넌트
 *
 * @dependencies
 * - components/ui/skeleton.tsx: Skeleton
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * 기본 정보 섹션 스켈레톤 UI
 */
export function DetailInfoSkeleton() {
  return (
    <section className="rounded-lg border bg-card p-6 space-y-6">
      {/* 제목 스켈레톤 */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>

      {/* 이미지 스켈레톤 */}
      <Skeleton variant="image" className="w-full h-64 md:h-96" />

      {/* 정보 영역 스켈레톤 */}
      <div className="space-y-4">
        {/* 주소 */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-24" />
        </div>

        {/* 전화번호 */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* 홈페이지 */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* 개요 */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton variant="text" lines={5} />
        </div>
      </div>
    </section>
  );
}

