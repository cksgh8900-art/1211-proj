/**
 * @file app/stats/page.tsx
 * @description 통계 대시보드 페이지
 *
 * 주요 기능:
 * 1. 전국 관광지 통계를 시각화하여 표시
 * 2. 지역별 관광지 분포 (Bar Chart)
 * 3. 타입별 관광지 분포 (Donut Chart)
 * 4. 통계 요약 카드
 *
 * 레이아웃 구조:
 * - 헤더 영역 (페이지 제목, 설명)
 * - 통계 요약 카드 영역
 * - 지역별 분포 차트 영역
 * - 타입별 분포 차트 영역
 *
 * @dependencies
 * - components/ui/skeleton.tsx: 스켈레톤 UI
 * - lib/types/stats.ts: 통계 타입 정의 (추후 사용)
 * - lib/api/stats-api.ts: 통계 데이터 수집 (추후 사용)
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsSummary } from "@/components/stats/stats-summary";
import { RegionChart } from "@/components/stats/region-chart";

/**
 * 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "통계 대시보드",
  description: "전국 관광지 통계를 한눈에 확인하세요. 지역별, 타입별 분포를 차트로 시각화합니다.",
  openGraph: {
    title: "통계 대시보드 | My Trip",
    description: "전국 관광지 통계를 한눈에 확인하세요",
    type: "website",
    locale: "ko_KR",
    siteName: "My Trip",
  },
  twitter: {
    card: "summary_large_image",
    title: "통계 대시보드 | My Trip",
    description: "전국 관광지 통계를 한눈에 확인하세요",
  },
};

/**
 * 통계 요약 카드 스켈레톤 UI
 */
function StatsSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border bg-card p-6 space-y-3"
          aria-hidden="true"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-full" variant="text" lines={2} />
        </div>
      ))}
    </div>
  );
}

/**
 * 차트 영역 스켈레톤 UI
 */
function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 w-full md:h-96" />
    </div>
  );
}

/**
 * 통계 대시보드 메인 컴포넌트 (Server Component)
 */
export default function StatsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* 헤더 영역 */}
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">통계 대시보드</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          전국 관광지 통계를 한눈에 확인하세요
        </p>
      </header>

      {/* 통계 요약 카드 영역 */}
      <section
        className="mb-8"
        aria-label="통계 요약"
      >
        <Suspense fallback={<StatsSummarySkeleton />}>
          <StatsSummary />
        </Suspense>
      </section>

      {/* 지역별 분포 차트 영역 */}
      <section
        className="mb-8"
        aria-label="지역별 관광지 분포"
      >
        <Suspense fallback={<ChartSkeleton />}>
          <RegionChart />
        </Suspense>
      </section>

      {/* 타입별 분포 차트 영역 */}
      <section
        className="mb-8"
        aria-label="타입별 관광지 분포"
      >
        <Suspense fallback={<ChartSkeleton />}>
          {/* 추후 TypeChart 컴포넌트가 들어갈 자리 */}
          <ChartSkeleton />
        </Suspense>
      </section>
    </main>
  );
}

