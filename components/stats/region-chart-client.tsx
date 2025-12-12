"use client";

/**
 * @file components/stats/region-chart-client.tsx
 * @description 지역별 분포 차트 클라이언트 컴포넌트
 *
 * 주요 기능:
 * 1. Bar Chart 렌더링 (recharts 기반)
 * 2. 바 클릭 시 해당 지역 목록 페이지로 이동
 * 3. 호버 툴팁 표시
 *
 * @dependencies
 * - components/ui/chart.tsx: ChartContainer, ChartTooltip, ChartTooltipContent
 * - recharts: BarChart, Bar, XAxis, YAxis, CartesianGrid
 * - next/navigation: useRouter
 * - lib/types/stats.ts: RegionStats
 */

import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { RegionStats } from "@/lib/types/stats";

interface RegionChartClientProps {
  data: RegionStats[];
}

/**
 * 숫자 포맷팅 함수 (천 단위 구분자)
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

/**
 * 차트 설정
 */
const chartConfig = {
  count: {
    label: "관광지 개수",
    color: "hsl(var(--chart-1))",
  },
} as const;

/**
 * 지역별 분포 차트 클라이언트 컴포넌트
 */
export function RegionChartClient({ data }: RegionChartClientProps) {
  const router = useRouter();

  // 데이터 정렬 (count 내림차순)
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  /**
   * 바 클릭 핸들러
   * 해당 지역 필터링된 홈페이지로 이동
   */
  const handleBarClick = (entry: RegionStats) => {
    router.push(`/?area=${entry.areaCode}`);
  };

  /**
   * 커스텀 툴팁 포맷터
   */
  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as RegionStats;
    return (
      <ChartTooltipContent
        label={data.areaName}
        payload={payload}
        formatter={(value) => [`${formatNumber(Number(value))}개`, "관광지"]}
      />
    );
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px]">
      <BarChart
        data={sortedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="areaName"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatNumber(value)}
        />
        <ChartTooltip content={customTooltip} />
        <Bar
          dataKey="count"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
          onClick={(data: any) => {
            if (data?.payload) {
              handleBarClick(data.payload as RegionStats);
            }
          }}
          style={{ cursor: "pointer" }}
        />
      </BarChart>
    </ChartContainer>
  );
}

