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

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TourItem } from "@/lib/types/tour";
import { NaverMap } from "./naver-map";
import { TourList } from "./tour-list";
import { TourPagination, type PaginationMode } from "./tour-pagination";
import { Button } from "./ui/button";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getToursByArea,
  searchToursByKeyword,
} from "@/actions/tours";

interface ListMapViewProps {
  tours: TourItem[];
  loading?: boolean;
  error?: Error | null;
  searchKeyword?: string;
  sort?: "latest" | "name";
  totalCount?: number;
  currentPage?: number;
}

type ViewMode = "list" | "map";

/**
 * 리스트와 지도를 함께 표시하는 컴포넌트 (내부 구현)
 */
function ListMapViewInner({
  tours: initialTours,
  loading = false,
  error = null,
  searchKeyword,
  sort,
  totalCount: initialTotalCount = 0,
  currentPage: initialPage = 1,
}: ListMapViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [hoveredTourId, setHoveredTourId] = useState<string | null>(null);
  const [tours, setTours] = useState<TourItem[]>(initialTours);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // URL에서 view 파라미터 읽기 (모바일용)
    const view = searchParams.get("view");
    return (view === "map" ? "map" : "list") as ViewMode;
  });
  const [paginationMode, setPaginationMode] = useState<PaginationMode>(() => {
    // URL에서 pagination mode 파라미터 읽기 (기본값: infinite)
    const mode = searchParams.get("paginationMode");
    return (mode === "pagination" ? "pagination" : "infinite");
  });

  // URL의 page 파라미터 읽기
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      const pageNum = parseInt(page, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    } else {
      setCurrentPage(1);
    }
  }, [searchParams]);

  // URL의 paginationMode 파라미터 읽기
  useEffect(() => {
    const mode = searchParams.get("paginationMode");
    setPaginationMode(
      mode === "pagination" ? "pagination" : "infinite"
    );
  }, [searchParams]);

  // 초기 데이터 업데이트 (필터/검색 변경 시)
  useEffect(() => {
    setTours(initialTours);
    setTotalCount(initialTotalCount);
    setCurrentPage(initialPage);
    setLoadMoreError(null);
  }, [initialTours, initialTotalCount, initialPage]);

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

  /**
   * 무한 스크롤: 더 많은 데이터 로드
   */
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      // 현재 필터/검색 파라미터 읽기
      const areaCode = searchParams.get("area") || undefined;
      const typeParams = searchParams.getAll("type");
      const contentTypeIds = typeParams.length > 0 ? typeParams : [];
      const keyword = searchParams.get("keyword") || undefined;
      const nextPage = currentPage + 1;

      let newTours: TourItem[] = [];
      let newTotalCount = 0;

      if (keyword && keyword.trim().length > 0) {
        // 검색 모드
        if (contentTypeIds.length === 0) {
          const result = await searchToursByKeyword({
            keyword,
            areaCode,
            numOfRows: 12,
            pageNo: nextPage,
          });
          newTours = result.items;
          newTotalCount = result.totalCount;
        } else if (contentTypeIds.length === 1) {
          const result = await searchToursByKeyword({
            keyword,
            areaCode,
            contentTypeId: contentTypeIds[0],
            numOfRows: 12,
            pageNo: nextPage,
          });
          newTours = result.items;
          newTotalCount = result.totalCount;
        } else {
          // 다중 타입: 각 타입별로 병렬 호출
          const results = await Promise.all(
            contentTypeIds.map((contentTypeId) =>
              searchToursByKeyword({
                keyword,
                areaCode,
                contentTypeId,
                numOfRows: 12,
                pageNo: 1, // 다중 타입일 때는 각 타입별 첫 페이지만
              })
            )
          );

          const tourMap = new Map<string, TourItem>();
          for (const result of results) {
            for (const tour of result.items) {
              if (!tourMap.has(tour.contentid)) {
                tourMap.set(tour.contentid, tour);
              }
            }
            if (newTotalCount === 0) {
              newTotalCount = result.totalCount;
            }
          }
          newTours = Array.from(tourMap.values());
        }
      } else {
        // 목록 모드
        if (contentTypeIds.length === 0) {
          const result = await getToursByArea({
            areaCode,
            numOfRows: 12,
            pageNo: nextPage,
          });
          newTours = result.items;
          newTotalCount = result.totalCount;
        } else if (contentTypeIds.length === 1) {
          const result = await getToursByArea({
            areaCode,
            contentTypeId: contentTypeIds[0],
            numOfRows: 12,
            pageNo: nextPage,
          });
          newTours = result.items;
          newTotalCount = result.totalCount;
        } else {
          // 다중 타입: 각 타입별로 병렬 호출
          const results = await Promise.all(
            contentTypeIds.map((contentTypeId) =>
              getToursByArea({
                areaCode,
                contentTypeId,
                numOfRows: 12,
                pageNo: 1, // 다중 타입일 때는 각 타입별 첫 페이지만
              })
            )
          );

          const tourMap = new Map<string, TourItem>();
          for (const result of results) {
            for (const tour of result.items) {
              if (!tourMap.has(tour.contentid)) {
                tourMap.set(tour.contentid, tour);
              }
            }
            if (newTotalCount === 0) {
              newTotalCount = result.totalCount;
            }
          }
          newTours = Array.from(tourMap.values());
        }
      }

      // 정렬 처리
      let sortedNewTours = [...newTours];
      if (contentTypeIds.length <= 1) {
        if (sort === "name") {
          sortedNewTours.sort((a, b) =>
            a.title.localeCompare(b.title, "ko")
          );
        } else {
          sortedNewTours.sort(
            (a, b) =>
              new Date(b.modifiedtime).getTime() -
              new Date(a.modifiedtime).getTime()
          );
        }
      }

      // 기존 목록에 추가 (중복 제거)
      const existingIds = new Set(tours.map((t) => t.contentid));
      const uniqueNewTours = sortedNewTours.filter(
        (t) => !existingIds.has(t.contentid)
      );

      setTours((prev) => [...prev, ...uniqueNewTours]);
      setTotalCount(newTotalCount);
      setCurrentPage(nextPage);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("데이터를 불러오는 중 오류가 발생했습니다.");
      setLoadMoreError(errorMessage);
      console.error("Failed to load more tours:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    currentPage,
    searchParams,
    sort,
    tours,
  ]);

  /**
   * 페이지 번호 방식: 페이지 변경
   */
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      router.push(`/?${params.toString()}`, { scroll: false });
      // 페이지가 변경되면 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, router]
  );

  /**
   * 페이지네이션 모드 전환
   */
  const handlePaginationModeChange = useCallback(
    (mode: PaginationMode) => {
      const params = new URLSearchParams(searchParams.toString());
      if (mode === "infinite") {
        params.delete("paginationMode");
        params.delete("page"); // 무한 스크롤 모드로 전환 시 페이지 리셋
      } else {
        params.set("paginationMode", "pagination");
      }
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // 페이지당 항목 수 (고정)
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasMore = currentPage < totalPages;

  return (
    <div className="space-y-4">
      {/* 모바일 탭 전환 버튼 */}
      <div 
        className="flex lg:hidden gap-2 border-b"
        role="tablist"
        aria-label="뷰 모드 전환"
      >
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleViewModeChange("list")}
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          role="tab"
          aria-selected={viewMode === "list"}
          aria-controls="list-view"
        >
          <List className="h-4 w-4 mr-2" aria-hidden="true" />
          목록
        </Button>
        <Button
          variant={viewMode === "map" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleViewModeChange("map")}
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          role="tab"
          aria-selected={viewMode === "map"}
          aria-controls="map-view"
        >
          <MapIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          지도
        </Button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* 좌측: List View */}
        <div
          id="list-view"
          className={cn(
            "list-view",
            viewMode === "map" && "hidden lg:block",
            viewMode === "list" && "block"
          )}
          role="tabpanel"
          aria-labelledby="list-tab"
        >
          <TourList
            tours={tours}
            loading={loading}
            error={error || loadMoreError}
            searchKeyword={searchKeyword}
            sort={sort}
            selectedTourId={selectedTourId}
            onTourClick={handleTourClick}
            onTourHover={handleTourHover}
            paginationMode={paginationMode}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={paginationMode === "infinite" ? handleLoadMore : undefined}
          />

          {/* 페이지네이션 컴포넌트 */}
          {!loading && !error && tours.length > 0 && (
            <TourPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasMore={hasMore}
              isLoading={isLoadingMore}
              onPageChange={handlePageChange}
              mode={paginationMode}
              onModeChange={handlePaginationModeChange}
            />
          )}
        </div>

        {/* 우측: Map View */}
        <div
          id="map-view"
          className={cn(
            "map-view",
            viewMode === "list" && "hidden lg:block",
            viewMode === "map" && "block"
          )}
          role="tabpanel"
          aria-labelledby="map-tab"
        >
          <NaverMap
            tours={tours}
            selectedTourId={selectedTourId}
            hoveredTourId={hoveredTourId}
            onMarkerClick={handleMarkerClick}
            onMarkerHover={handleMarkerHover}
            className="h-[300px] md:h-[500px] lg:h-[600px]"
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

