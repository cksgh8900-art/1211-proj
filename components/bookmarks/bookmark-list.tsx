"use client";

/**
 * @file components/bookmarks/bookmark-list.tsx
 * @description 북마크 목록 컴포넌트
 *
 * 주요 기능:
 * 1. 북마크한 관광지 목록을 카드 형태로 표시
 * 2. 정렬 기능 (최신순, 이름순, 지역별)
 * 3. 개별 삭제 기능
 * 4. 일괄 삭제 기능
 * 5. 빈 상태 처리
 * 6. 로딩 상태 (Skeleton UI)
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard 컴포넌트
 * - components/ui/skeleton.tsx: 스켈레톤 UI
 * - components/bookmarks/bookmark-delete-button.tsx: 개별 삭제 버튼
 * - components/bookmarks/bookmark-bulk-actions.tsx: 일괄 삭제 기능
 * - lib/types/tour.ts: TourItem 타입
 * - lib/types/stats.ts: AREA_CODE_NAME 상수
 */

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { TourItem } from "@/lib/types/tour";
import { AREA_CODE_NAME } from "@/lib/types/stats";
import { TourCard } from "@/components/tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookmarkDeleteButton } from "./bookmark-delete-button";
import { BookmarkBulkActions, BookmarkItemCheckbox } from "./bookmark-bulk-actions";
import { cn } from "@/lib/utils";
import type { BookmarkSortOption } from "./bookmark-sort";

interface BookmarkListProps {
  tours: TourItem[];
  bookmarkDates: Map<string, string>;
  className?: string;
}

/**
 * 빈 상태 UI
 */
function BookmarkListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="rounded-full bg-muted p-6">
        <Bookmark className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold">북마크가 없습니다</h3>
        <p className="text-muted-foreground">
          관광지를 북마크하면 여기서 확인할 수 있습니다.
          <br />
          관심 있는 관광지를 찾아 북마크해보세요!
        </p>
      </div>
      <Link href="/">
        <Button size="lg" className="gap-2">
          <MapPin className="h-5 w-5" aria-hidden="true" />
          관광지 둘러보기
        </Button>
      </Link>
    </div>
  );
}

/**
 * 북마크 목록 컴포넌트
 */
export function BookmarkList({
  tours,
  bookmarkDates,
  className,
}: BookmarkListProps) {
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 정렬 옵션 읽기
  const sortOption =
    (searchParams.get("sort") as BookmarkSortOption) || "latest";

  // 정렬된 목록 계산
  const sortedTours = useMemo(() => {
    const sorted = [...tours];

    switch (sortOption) {
      case "name":
        // 이름순 (가나다순)
        sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
        break;
      case "region":
        // 지역별 (지역코드 오름차순 → 이름순)
        sorted.sort((a, b) => {
          const regionCompare = a.areacode.localeCompare(b.areacode);
          if (regionCompare !== 0) return regionCompare;
          return a.title.localeCompare(b.title, "ko");
        });
        break;
      case "latest":
      default:
        // 최신순 (북마크 생성일시 내림차순)
        sorted.sort((a, b) => {
          const dateA = bookmarkDates.get(a.contentid) || "";
          const dateB = bookmarkDates.get(b.contentid) || "";
          return dateB.localeCompare(dateA);
        });
        break;
    }

    return sorted;
  }, [tours, sortOption, bookmarkDates]);

  // 개별 항목 선택/해제 토글
  const handleToggleSelect = (contentId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(contentId)) {
      newSelected.delete(contentId);
    } else {
      newSelected.add(contentId);
    }
    setSelectedIds(newSelected);
  };

  // 빈 상태 처리
  if (tours.length === 0) {
    return <BookmarkListEmpty />;
  }

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectedIds.size === sortedTours.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedTours.map((tour) => tour.contentid)));
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 일괄 삭제 액션 */}
      <BookmarkBulkActions
        tours={sortedTours.map((tour) => ({
          contentid: tour.contentid,
          title: tour.title,
        }))}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
      />

      {/* 북마크 목록 */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        role="list"
        aria-label="북마크한 관광지 목록"
      >
        {sortedTours.map((tour) => {
          const isSelected = selectedIds.has(tour.contentid);
          return (
            <div
              key={tour.contentid}
              role="listitem"
              className="relative group"
            >
              {/* 체크박스 (호버 시 표시) */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <BookmarkItemCheckbox
                  contentId={tour.contentid}
                  isSelected={isSelected}
                  onToggle={handleToggleSelect}
                />
              </div>

              {/* 삭제 버튼 (호버 시 표시) */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <BookmarkDeleteButton
                  contentId={tour.contentid}
                  tourTitle={tour.title}
                />
              </div>

              {/* 관광지 카드 */}
              <TourCard tour={tour} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 북마크 목록 스켈레톤 UI
 */
export function BookmarkListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="card" />
      ))}
    </div>
  );
}

