/**
 * @file components/stats/region-chart.tsx
 * @description 지역별 분포 차트 컴포넌트 (Server Component)
 *
 * 주요 기능:
 * 1. 지역별 통계 데이터 수집 (getRegionStats)
 * 2. 차트 컴포넌트 렌더링
 * 3. 에러 처리
 *
 * @dependencies
 * - lib/api/stats-api.ts: getRegionStats
 * - components/stats/region-chart-client.tsx: RegionChartClient
 * - components/ui/error.tsx: ErrorMessage
 * - lucide-react: BarChart3
 */

import { BarChart3 } from "lucide-react";
import { getRegionStats } from "@/lib/api/stats-api";
import { RegionChartClient } from "./region-chart-client";
import { ErrorMessage } from "@/components/ui/error";

/**
 * 지역별 분포 차트 메인 컴포넌트 (Server Component)
 */
export async function RegionChart() {
  try {
    const data = await getRegionStats();

    // 데이터가 비어있는 경우 처리
    if (!data || data.length === 0) {
      return (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">지역별 관광지 분포</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            통계 데이터를 불러올 수 없습니다.
          </p>
        </div>
      );
    }

    return (
      <article
        className="rounded-lg border bg-card p-6 space-y-4"
        aria-label="지역별 관광지 분포 차트"
      >
        {/* 제목 */}
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">지역별 관광지 분포</h2>
        </div>

        {/* 차트 */}
        <div className="w-full" aria-label={`${data.length}개 지역의 관광지 분포`}>
          <RegionChartClient data={data} />
        </div>
      </article>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return (
      <ErrorMessage
        message={errorMessage}
        type="api"
        title="지역별 통계 데이터를 불러올 수 없습니다"
      />
    );
  }
}

