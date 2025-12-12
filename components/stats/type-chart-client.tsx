"use client";

/**
 * @file components/stats/type-chart-client.tsx
 * @description 타입별 분포 차트 클라이언트 컴포넌트
 *
 * 주요 기능:
 * 1. Donut Chart 렌더링 (recharts 기반)
 * 2. 섹션 클릭 시 해당 타입 목록 페이지로 이동
 * 3. 호버 툴팁 표시 (타입명, 개수, 비율)
 *
 * @dependencies
 * - components/ui/chart.tsx: ChartContainer, ChartTooltip, ChartTooltipContent
 * - recharts: PieChart, Pie, Cell
 * - next/navigation: useRouter
 * - lib/types/stats.ts: TypeStats
 */

import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TypeStats } from "@/lib/types/stats";

interface TypeChartClientProps {
  data: TypeStats[];
}

/**
 * 숫자 포맷팅 함수 (천 단위 구분자)
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

/**
 * 백분율 포맷팅 함수 (소수점 1자리)
 */
function formatPercentage(percentage: number | undefined): string {
  if (percentage === undefined) return "0%";
  return `${percentage.toFixed(1)}%`;
}

/**
 * 차트 색상 배열 (chart-1 ~ chart-8)
 */
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  // chart-6~8가 없으므로 1~5를 순환 사용
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
] as const;

/**
 * 차트 설정
 */
const chartConfig = {
  count: {
    label: "관광지 개수",
  },
} as const;

/**
 * 타입별 분포 차트 클라이언트 컴포넌트
 */
export function TypeChartClient({ data }: TypeChartClientProps) {
  const router = useRouter();

  // 데이터 정렬 (count 내림차순)
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  /**
   * 섹션 클릭 핸들러
   * 해당 타입 필터링된 홈페이지로 이동
   */
  const handlePieClick = (entry: TypeStats) => {
    router.push(`/?type=${entry.contentTypeId}`);
  };

  /**
   * 커스텀 툴팁 포맷터
   */
  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as TypeStats;
    return (
      <ChartTooltipContent>
        <div className="font-medium">{data.typeName}</div>
        <div className="text-sm text-muted-foreground">
          관광지 {formatNumber(data.count)}개
        </div>
        <div className="text-sm text-muted-foreground">
          비율 {formatPercentage(data.percentage)}
        </div>
      </ChartTooltipContent>
    );
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px]">
      <PieChart>
        <Pie
          data={sortedData}
          dataKey="count"
          nameKey="typeName"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          onClick={(data: any) => {
            if (data?.payload) {
              handlePieClick(data.payload as TypeStats);
            }
          }}
          style={{ cursor: "pointer" }}
        >
          {sortedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <ChartTooltip content={customTooltip} />
      </PieChart>
    </ChartContainer>
  );
}

