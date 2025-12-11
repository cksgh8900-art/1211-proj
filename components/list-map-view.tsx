"use client";

/**
 * @file components/list-map-view.tsx
 * @description 리스트와 지도를 함께 관리하는 Client Component
 *
 * 주요 기능:
 * 1. 지도-리스트 연동 상태 관리
 * 2. 반응형 레이아웃 (데스크톱: 분할, 모바일: 탭)
 *
 * @dependencies
 * - components/naver-map.tsx
 * - components/tour-list.tsx
 */

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TourItem } from "@/lib/types/tour";
import { NaverMap } from "./naver-map";
import { TourList } from "./tour-list";
import { Button } from "./ui/button";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListMapViewProps {
  tours: TourItem[];
  loading?: boolean;
  error?: Error | null;
  searchKeyword?: string;
  sort?: "latest" | "name";
}

type ViewMode = "list" | "map";

/**
 * 리스트와 지도를 함께 표시하는 컴포넌트 (내부 구현)
 */
function ListMapViewInner({
  tours,
  loading = false,
  error = null,
  searchKeyword,
  sort,
}: ListMapViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [hoveredTourId, setHoveredTourId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // URL에서 view 파라미터 읽기 (모바일용)
    const view = searchParams.get("view");
    return (view === "map" ? "map" : "list") as ViewMode;
  });

  // URL의 view 파라미터와 동기화
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "map" || view === "list") {
      setViewMode(view);
    }
  }, [searchParams]);

  // URL의 selectedId 파라미터 읽기
  useEffect(() => {
    const selectedId = searchParams.get("selectedId");
    setSelectedTourId(selectedId);
  }, [searchParams]);


  /**
   * 마커 클릭 핸들러 (지도에서 클릭 시)
   */
  const handleMarkerClick = (tour: TourItem) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedId", tour.contentid);
    router.push(`/?${params.toString()}`, { scroll: false });
    setSelectedTourId(tour.contentid);

    // 모바일에서 리스트 뷰로 전환하여 선택된 항목 표시
    if (window.innerWidth < 1024) {
      setViewMode("list");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("view", "list");
      newParams.set("selectedId", tour.contentid);
      router.push(`/?${newParams.toString()}`, { scroll: false });
    }
  };

  /**
   * 마커 호버 핸들러 (지도에서 호버 시)
   */
  const handleMarkerHover = (tour: TourItem | null) => {
    setHoveredTourId(tour?.contentid || null);
  };

  /**
   * 리스트 항목 클릭 핸들러
   */
  const handleTourClick = (tour: TourItem) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedId", tour.contentid);
    router.push(`/?${params.toString()}`, { scroll: false });
    setSelectedTourId(tour.contentid);
  };

  /**
   * 리스트 항목 호버 핸들러
   */
  const handleTourHover = (tour: TourItem | null) => {
    setHoveredTourId(tour?.contentid || null);
  };

  /**
   * 뷰 모드 전환 (모바일용)
   */
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    if (mode === "list") {
      params.delete("view");
    } else {
      params.set("view", "map");
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      {/* 모바일 탭 전환 버튼 */}
      <div className="flex lg:hidden gap-2 border-b">
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleViewModeChange("list")}
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <List className="h-4 w-4 mr-2" />
          목록
        </Button>
        <Button
          variant={viewMode === "map" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleViewModeChange("map")}
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <MapIcon className="h-4 w-4 mr-2" />
          지도
        </Button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* 좌측: List View */}
        <div
          className={cn(
            "list-view",
            viewMode === "map" && "hidden lg:block",
            viewMode === "list" && "block"
          )}
        >
          <TourList
            tours={tours}
            loading={loading}
            error={error}
            searchKeyword={searchKeyword}
            sort={sort}
            selectedTourId={selectedTourId}
            onTourClick={handleTourClick}
            onTourHover={handleTourHover}
          />
        </div>

        {/* 우측: Map View */}
        <div
          className={cn(
            "map-view",
            viewMode === "list" && "hidden lg:block",
            viewMode === "map" && "block"
          )}
        >
          <NaverMap
            tours={tours}
            selectedTourId={selectedTourId}
            hoveredTourId={hoveredTourId}
            onMarkerClick={handleMarkerClick}
            onMarkerHover={handleMarkerHover}
            className="h-[400px] lg:h-[600px]"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 리스트와 지도를 함께 표시하는 컴포넌트 (Suspense 래퍼)
 */
export function ListMapView(props: ListMapViewProps) {
  return (
    <Suspense fallback={<ListMapViewInner loading={true} tours={[]} />}>
      <ListMapViewInner {...props} />
    </Suspense>
  );
}

