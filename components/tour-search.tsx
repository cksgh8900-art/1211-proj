"use client";

/**
 * @file components/tour-search.tsx
 * @description 관광지 검색 컴포넌트
 *
 * 주요 기능:
 * 1. 검색창 UI
 * 2. 검색어 입력 및 검색 실행
 * 3. URL 쿼리 파라미터 기반 상태 관리
 * 4. 검색어 초기화
 *
 * @dependencies
 * - next/navigation: useSearchParams, useRouter
 * - components/ui/input.tsx: Input 컴포넌트
 * - components/ui/button.tsx: Button 컴포넌트
 * - lucide-react: Search, X 아이콘
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourSearchProps {
  className?: string;
  placeholder?: string;
  variant?: "default" | "compact";
}

/**
 * 관광지 검색 컴포넌트
 */
export function TourSearch({
  className,
  placeholder = "관광지 검색...",
  variant = "default",
}: TourSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // URL에서 현재 검색어 읽기
  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    setInputValue(keyword);
  }, [searchParams]);

  /**
   * URL 쿼리 파라미터 업데이트
   */
  const updateURL = useCallback(
    (keyword: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (keyword && keyword.trim().length > 0) {
        params.set("keyword", keyword.trim());
      } else {
        params.delete("keyword");
      }

      // URL 업데이트 (replaceIn: 브라우저 히스토리에 추가하지 않음)
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  /**
   * 검색 실행
   */
  const handleSearch = useCallback(() => {
    if (inputValue.trim().length === 0) {
      // 빈 검색어는 URL에서 제거
      updateURL(undefined);
      return;
    }

    setIsSearching(true);
    updateURL(inputValue);
    // 로딩 상태는 URL 업데이트 후 자동으로 해제됨 (페이지 리렌더링)
  }, [inputValue, updateURL]);

  /**
   * 검색어 초기화
   */
  const handleClear = useCallback(() => {
    setInputValue("");
    updateURL(undefined);
  }, [updateURL]);

  /**
   * 엔터 키 처리
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const hasKeyword = searchParams.get("keyword");

  if (variant === "compact") {
    return (
      <div className={cn("relative flex items-center", className)}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
        <Input
          type="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 min-w-[300px] md:min-w-[500px]"
          aria-label="관광지 검색"
        />
        {hasKeyword && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 h-7 w-7"
            aria-label="검색어 초기화"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="ml-2"
          aria-label="검색"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1 min-w-[300px] md:min-w-[500px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
        <Input
          type="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
          aria-label="관광지 검색"
        />
        {hasKeyword && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 h-7 w-7"
            aria-label="검색어 초기화"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        type="button"
        onClick={handleSearch}
        disabled={isSearching}
        aria-label="검색"
      >
        {isSearching ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            검색 중...
          </>
        ) : (
          "검색"
        )}
      </Button>
    </div>
  );
}

