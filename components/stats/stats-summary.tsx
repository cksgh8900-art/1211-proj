/**
 * @file components/stats/stats-summary.tsx
 * @description 통계 요약 카드 컴포넌트
 *
 * 주요 기능:
 * 1. 전체 관광지 수 표시
 * 2. Top 3 지역 표시 (카드 형태)
 * 3. Top 3 타입 표시 (카드 형태)
 * 4. 마지막 업데이트 시간 표시
 *
 * @dependencies
 * - lib/api/stats-api.ts: getStatsSummary
 * - lib/types/stats.ts: StatsSummary, RegionStats, TypeStats
 * - components/ui/error.tsx: ErrorMessage
 * - lucide-react: BarChart3, MapPin, Award, Tag, Clock
 */

import { BarChart3, MapPin, Award, Tag, Clock } from "lucide-react";
import { getStatsSummary } from "@/lib/api/stats-api";
import type { StatsSummary } from "@/lib/types/stats";
import { ErrorMessage } from "@/components/ui/error";

/**
 * 숫자 포맷팅 함수 (천 단위 구분자)
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

/**
 * 날짜 포맷팅 함수 (한국어 형식)
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * 백분율 포맷팅 함수 (소수점 1자리)
 */
function formatPercentage(percentage: number | undefined): string {
  if (percentage === undefined) return "0%";
  return `${percentage.toFixed(1)}%`;
}

/**
 * 순위 뱃지 컴포넌트
 */
function RankBadge({ rank }: { rank: number }) {
  const rankColors = {
    1: "bg-yellow-500 text-white",
    2: "bg-gray-400 text-white",
    3: "bg-orange-500 text-white",
  };

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
        rankColors[rank as keyof typeof rankColors] || "bg-muted text-muted-foreground"
      }`}
      aria-label={`${rank}위`}
    >
      {rank}
    </span>
  );
}

/**
 * 전체 관광지 수 카드
 */
function TotalCountCard({ totalCount }: { totalCount: number }) {
  return (
    <article
      className="rounded-lg border bg-card p-6 space-y-3"
      aria-label="전체 관광지 수"
    >
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-medium text-muted-foreground">전체 관광지</h3>
      </div>
      <p className="text-3xl md:text-4xl font-bold" aria-label={`전체 관광지 ${formatNumber(totalCount)}개`}>
        {formatNumber(totalCount)}
      </p>
      <p className="text-xs text-muted-foreground">전국 관광지 총 개수</p>
    </article>
  );
}

/**
 * Top 3 지역 카드
 */
function TopRegionsCard({ topRegions }: { topRegions: StatsSummary["topRegions"] }) {
  return (
    <article
      className="rounded-lg border bg-card p-6 space-y-4"
      aria-label="인기 지역 Top 3"
    >
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-medium text-muted-foreground">인기 지역 Top 3</h3>
      </div>
      <ol className="space-y-3" aria-label="지역 순위 목록">
        {topRegions.map((region, index) => (
          <li
            key={region.areaCode}
            className="flex items-center justify-between gap-2"
            aria-label={`${index + 1}위: ${region.areaName}, 관광지 ${formatNumber(region.count)}개`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <RankBadge rank={index + 1} />
              <span className="font-medium truncate">{region.areaName}</span>
            </div>
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              {formatNumber(region.count)}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}

/**
 * Top 3 타입 카드
 */
function TopTypesCard({ topTypes }: { topTypes: StatsSummary["topTypes"] }) {
  return (
    <article
      className="rounded-lg border bg-card p-6 space-y-4"
      aria-label="인기 타입 Top 3"
    >
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-medium text-muted-foreground">인기 타입 Top 3</h3>
      </div>
      <ol className="space-y-3" aria-label="타입 순위 목록">
        {topTypes.map((type, index) => (
          <li
            key={type.contentTypeId}
            className="flex items-center justify-between gap-2"
            aria-label={`${index + 1}위: ${type.typeName}, 관광지 ${formatNumber(type.count)}개 (${formatPercentage(type.percentage)})`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <RankBadge rank={index + 1} />
              <span className="font-medium truncate">{type.typeName}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-lg font-bold text-primary">
                {formatNumber(type.count)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({formatPercentage(type.percentage)})
              </span>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

/**
 * 마지막 업데이트 시간 표시
 */
function LastUpdated({ lastUpdated }: { lastUpdated: Date }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Clock className="h-4 w-4" aria-hidden="true" />
      <span>
        마지막 업데이트: <time dateTime={lastUpdated.toISOString()}>{formatDate(lastUpdated)}</time>
      </span>
    </div>
  );
}

/**
 * 통계 요약 카드 메인 컴포넌트 (Server Component)
 */
export async function StatsSummary() {
  try {
    const summary = await getStatsSummary();

    return (
      <div className="space-y-4">
        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TotalCountCard totalCount={summary.totalCount} />
          <TopRegionsCard topRegions={summary.topRegions} />
          <TopTypesCard topTypes={summary.topTypes} />
        </div>

        {/* 마지막 업데이트 시간 */}
        <LastUpdated lastUpdated={summary.lastUpdated} />
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return (
      <ErrorMessage
        message={errorMessage}
        type="api"
        title="통계 데이터를 불러올 수 없습니다"
        defaultRetry={true}
      />
    );
  }
}

