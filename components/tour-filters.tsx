"use client";

/**
 * @file components/tour-filters.tsx
 * @description 관광지 필터 컴포넌트
 *
 * 주요 기능:
 * 1. 지역 필터 (시/도 선택)
 * 2. 관광 타입 필터 (다중 선택)
 * 3. 정렬 옵션
 * 4. URL 쿼리 파라미터 기반 상태 관리
 *
 * @dependencies
 * - next/navigation: useSearchParams, useRouter
 * - components/ui/select.tsx: Select 컴포넌트
 * - components/ui/checkbox.tsx: Checkbox 컴포넌트
 * - components/ui/button.tsx: Button 컴포넌트
 * - lib/types/tour.ts: AreaCode 타입
 * - lib/types/stats.ts: CONTENT_TYPE_NAME 상수
 */

import { useRouter, useSearchParams } from "next/navigation";
import type { AreaCode } from "@/lib/types/tour";
import { CONTENT_TYPE_NAME } from "@/lib/types/stats";
import { CONTENT_TYPE_ID } from "@/lib/types/tour";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourFiltersProps {
  areaCodes: AreaCode[];
  className?: string;
}

type SortOption = "latest" | "name";

/**
 * 관광 타입 목록 (순서 보장)
 */
const CONTENT_TYPES = [
  { id: CONTENT_TYPE_ID.TOURIST_SPOT, name: CONTENT_TYPE_NAME["12"] },
  { id: CONTENT_TYPE_ID.CULTURAL_FACILITY, name: CONTENT_TYPE_NAME["14"] },
  { id: CONTENT_TYPE_ID.FESTIVAL, name: CONTENT_TYPE_NAME["15"] },
  { id: CONTENT_TYPE_ID.TOUR_COURSE, name: CONTENT_TYPE_NAME["25"] },
  { id: CONTENT_TYPE_ID.LEISURE_SPORTS, name: CONTENT_TYPE_NAME["28"] },
  { id: CONTENT_TYPE_ID.ACCOMMODATION, name: CONTENT_TYPE_NAME["32"] },
  { id: CONTENT_TYPE_ID.SHOPPING, name: CONTENT_TYPE_NAME["38"] },
  { id: CONTENT_TYPE_ID.RESTAURANT, name: CONTENT_TYPE_NAME["39"] },
] as const;

export function TourFilters({ areaCodes, className }: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 필터 값 읽기
  const currentArea = searchParams.get("area") || undefined;
  const currentTypes = searchParams.getAll("type");
  const currentSort = (searchParams.get("sort") as SortOption) || "latest";

  /**
   * URL 파라미터 업데이트 함수
   */
  const updateURL = (updates: {
    area?: string | undefined;
    types?: string[];
    sort?: SortOption;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // 지역 필터 업데이트
    if (updates.area === undefined || updates.area === "all") {
      params.delete("area");
    } else {
      params.set("area", updates.area);
    }

    // 타입 필터 업데이트
    params.delete("type");
    if (updates.types && updates.types.length > 0) {
      updates.types.forEach((type) => {
        params.append("type", type);
      });
    }

    // 정렬 업데이트
    if (updates.sort) {
      params.set("sort", updates.sort);
    } else if (!updates.sort && updates.sort !== undefined) {
      params.delete("sort");
    }

    // 페이지네이션 리셋 (필터 변경 시 첫 페이지로)
    params.delete("page");

    // URL 업데이트 (replaceIn: 브라우저 히스토리에 추가하지 않음)
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  /**
   * 지역 필터 변경 핸들러
   */
  const handleAreaChange = (value: string) => {
    updateURL({ area: value === "all" ? undefined : value });
  };

  /**
   * 타입 필터 토글 핸들러
   */
  const handleTypeToggle = (typeId: string) => {
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter((t) => t !== typeId)
      : [...currentTypes, typeId];
    updateURL({ types: newTypes });
  };

  /**
   * 정렬 옵션 변경 핸들러
   */
  const handleSortChange = (value: SortOption) => {
    updateURL({ sort: value });
  };

  /**
   * 필터 초기화
   */
  const handleReset = () => {
    router.push("/", { scroll: false });
  };

  // 모든 타입이 선택되었는지 확인
  const allTypesSelected =
    currentTypes.length === 0 || currentTypes.length === CONTENT_TYPES.length;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* 필터 제목 및 초기화 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium">필터</h2>
        </div>
        {(currentArea || currentTypes.length > 0 || currentSort !== "latest") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs"
          >
            초기화
          </Button>
        )}
      </div>

      {/* 필터 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* 지역 필터 */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">
            지역
          </label>
          <Select value={currentArea || "all"} onValueChange={handleAreaChange}>
            <SelectTrigger className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="전체 지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 지역</SelectItem>
              {areaCodes.map((area) => (
                <SelectItem key={area.code} value={area.code}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 관광 타입 필터 */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">
            관광 타입
          </label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((type) => {
              const isSelected = currentTypes.includes(type.id);
              return (
                <Button
                  key={type.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeToggle(type.id)}
                  className="h-8 text-xs"
                >
                  {type.name}
                </Button>
              );
            })}
          </div>
          {allTypesSelected && currentTypes.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              전체 타입이 선택됨
            </p>
          )}
        </div>

        {/* 정렬 옵션 */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">
            정렬
          </label>
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

