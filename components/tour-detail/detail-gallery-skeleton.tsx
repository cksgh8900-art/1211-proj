/**
 * @file components/tour-detail/detail-gallery-skeleton.tsx
 * @description 이미지 갤러리 섹션 스켈레톤 UI
 *
 * 로딩 상태 표시용 스켈레톤 컴포넌트
 *
 * @dependencies
 * - components/ui/skeleton.tsx: Skeleton
 */

import { Skeleton } from "@/components/ui/skeleton";

/**
 * 이미지 갤러리 섹션 스켈레톤 UI
 */
export function DetailGallerySkeleton() {
  return (
    <section className="rounded-lg border bg-card p-6 space-y-4">
      {/* 제목 스켈레톤 */}
      <Skeleton className="h-8 w-32" />

      {/* 메인 이미지 스켈레톤 */}
      <Skeleton variant="image" className="w-full aspect-video rounded-lg" />

      {/* 썸네일 그리드 스켈레톤 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="image"
            className="aspect-video rounded-lg"
          />
        ))}
      </div>
    </section>
  );
}

