/**
 * @file components/tour-detail/detail-pet-tour-skeleton.tsx
 * @description 반려동물 동반 정보 섹션 스켈레톤 UI
 *
 * 로딩 상태 표시용 스켈레톤 컴포넌트
 *
 * @dependencies
 * - components/ui/skeleton.tsx: Skeleton
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * 반려동물 동반 정보 섹션 스켈레톤 UI
 */
export function DetailPetTourSkeleton() {
  return (
    <section className="rounded-lg border bg-card p-6 space-y-4">
      {/* 제목 스켈레톤 */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-48" />
      </div>

      {/* 정보 항목 스켈레톤 */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-full pl-7" />
            {index % 2 === 0 && <Skeleton className="h-4 w-3/4 pl-7" />}
          </div>
        ))}
      </div>
    </section>
  );
}

