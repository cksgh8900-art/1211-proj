"use client";

/**
 * @file components/tour-pagination.tsx
 * @description 페이지네이션 컴포넌트 (무한 스크롤 및 페이지 번호 방식)
 *
 * 주요 기능:
 * 1. 페이지 번호 방식 UI (1, 2, 3... 버튼)
 * 2. 모드 전환 토글 (무한 스크롤 ↔ 페이지 번호)
 * 3. 이전/다음 버튼
 */

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaginationMode = "infinite" | "pagination";

interface TourPaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  mode: PaginationMode;
  onModeChange: (mode: PaginationMode) => void;
}

/**
 * 페이지네이션 컴포넌트
 * 
 * 무한 스크롤 모드: 모드 전환 토글만 표시
 * 페이지 번호 모드: 페이지 번호 버튼, 이전/다음 버튼, 모드 전환 토글 표시
 */
export function TourPagination({
  currentPage,
  totalPages,
  hasMore,
  isLoading,
  onPageChange,
  mode,
  onModeChange,
}: TourPaginationProps) {
  // 페이지 번호 생성 (최대 5개 표시)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // 전체 페이지 수가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변 페이지만 표시
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 모드 전환 토글 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">표시 방식:</span>
        <Button
          variant={mode === "infinite" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("infinite")}
          className="gap-2"
        >
          <ArrowDown className="h-4 w-4" />
          무한 스크롤
        </Button>
        <Button
          variant={mode === "pagination" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("pagination")}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          페이지 번호
        </Button>
      </div>

      {/* 페이지 번호 방식 UI */}
      {mode === "pagination" && totalPages > 0 && (
        <div className="flex items-center gap-2">
          {/* 이전 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            aria-label="이전 페이지"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          {/* 페이지 번호 버튼들 */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-sm text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                  className={cn(
                    "min-w-[2.5rem]",
                    isActive && "font-semibold"
                  )}
                  aria-label={`${pageNum}페이지`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          {/* 다음 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            aria-label="다음 페이지"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 페이지 정보 (페이지 번호 방식) */}
      {mode === "pagination" && totalPages > 0 && (
        <p className="text-sm text-muted-foreground">
          {currentPage} / {totalPages} 페이지
        </p>
      )}
    </div>
  );
}

