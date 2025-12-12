"use client";

/**
 * @file components/tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 주요 기능:
 * 1. 관광지 목록을 그리드 레이아웃으로 표시
 * 2. 로딩 상태 (Skeleton UI)
 * 3. 빈 상태 처리
 * 4. 에러 처리
 * 5. 무한 스크롤 (Intersection Observer)
 *
 * @dependencies
 * - components/tour-card.tsx: TourCard 컴포넌트
 * - components/ui/skeleton.tsx: 스켈레톤 UI
 * - components/ui/error.tsx: 에러 메시지
 * - lib/types/tour.ts: TourItem 타입
 */

import { useEffect, useRef } from "react";
import type { TourItem } from "@/lib/types/tour";
import { TourCard } from "./tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourListProps {
  tours: TourItem[];
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
  sort?: "latest" | "name"; // 정렬 옵션 (서버에서 정렬된 경우 전달)
  searchKeyword?: string; // 검색 키워드 (검색 결과일 때 표시)
  selectedTourId?: string | null;
  onTourClick?: (tour: TourItem) => void;
  onTourHover?: (tour: TourItem | null) => void;
  // 페이지네이션 관련 props
  paginationMode?: "infinite" | "pagination";
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * 기본 재시도 함수
 */
function defaultOnRetry() {
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

/**
 * 스켈레톤 로딩 UI
 */
function TourListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="card" />
      ))}
    </div>
  );
}

/**
 * 빈 상태 UI
 */
function TourListEmpty({ searchKeyword }: { searchKeyword?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <MapPin className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">
          {searchKeyword
            ? `"${searchKeyword}" 검색 결과가 없습니다`
            : "관광지를 찾을 수 없습니다"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {searchKeyword
            ? "다른 키워드로 검색하거나 필터를 조정해보세요"
            : "다른 지역이나 타입을 선택해보세요"}
        </p>
      </div>
    </div>
  );
}

/**
 * 검색 결과 헤더
 */
function SearchResultHeader({
  keyword,
  count,
}: {
  keyword: string;
  count: number;
}) {
  return (
    <div className="mb-4 px-1">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          &quot;{keyword}&quot;
        </span>{" "}
        검색 결과{" "}
        <span className="font-medium text-foreground">{count}개</span>
      </p>
    </div>
  );
}

export function TourList({
  tours,
  loading = false,
  error = null,
  onRetry,
  className,
  searchKeyword,
  selectedTourId,
  onTourClick,
  onTourHover,
  paginationMode = "infinite",
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: TourListProps) {
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용한 무한 스크롤
  useEffect(() => {
    if (paginationMode !== "infinite" || !hasMore || isLoadingMore || !onLoadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1, // 10% 보이면 트리거
        rootMargin: "100px", // 뷰포트 아래 100px 지점에서 미리 로드
      }
    );

    const target = observerTargetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [paginationMode, hasMore, isLoadingMore, onLoadMore]);
  // 로딩 상태
  if (loading) {
    return (
      <div className={className}>
        <TourListSkeleton />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={className}>
        <ErrorMessage
          message={
            error.message ||
            "관광지 목록을 불러오는 중 오류가 발생했습니다."
          }
          type="api"
          onRetry={onRetry || defaultOnRetry}
          autoDetectOffline={true}
        />
      </div>
    );
  }

  // 빈 상태
  if (tours.length === 0) {
    return (
      <div className={className}>
        <TourListEmpty searchKeyword={searchKeyword} />
      </div>
    );
  }

  // 목록 표시
  return (
    <div className={className}>
      {searchKeyword && (
        <div role="status" aria-live="polite" aria-atomic="true">
          <SearchResultHeader keyword={searchKeyword} count={tours.length} />
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
        )}
        role="list"
        aria-label="관광지 목록"
      >
        {tours.map((tour) => (
          <TourCard
            key={tour.contentid}
            tour={tour}
            selected={selectedTourId === tour.contentid}
            onCardClick={onTourClick}
            onCardHover={onTourHover}
          />
        ))}
      </div>

      {/* 무한 스크롤 감지 영역 */}
      {paginationMode === "infinite" && hasMore && (
        <div
          ref={observerTargetRef}
          className="flex items-center justify-center py-8"
          role="status"
          aria-live="polite"
          aria-label="더 많은 항목 로드 중"
        >
          {isLoadingMore && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 
                  className="h-5 w-5 animate-spin text-primary" 
                  aria-hidden="true"
                />
                <span className="font-medium">더 많은 관광지를 불러오는 중...</span>
              </div>
              <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse w-1/3" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 무한 스크롤: 더 이상 항목이 없을 때 */}
      {paginationMode === "infinite" && !hasMore && tours.length > 0 && (
        <div 
          className="flex items-center justify-center py-8"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="text-primary">✓</span>
            모든 관광지를 불러왔습니다.
          </p>
        </div>
      )}

      {/* 에러 메시지 (추가 로드 실패 시) */}
      {error && (
        <div className="mt-4">
          <ErrorMessage
            message={error.message || "데이터를 불러오는 중 오류가 발생했습니다."}
            type="api"
            onRetry={onRetry || defaultOnRetry}
            autoDetectOffline={true}
          />
        </div>
      )}
    </div>
  );
}

