"use client";

/**
 * @file components/bookmarks/bookmark-sort.tsx
 * @description 북마크 정렬 컴포넌트
 *
 * 주요 기능:
 * 1. 정렬 옵션 선택 UI
 * 2. URL 쿼리 파라미터로 상태 관리
 * 3. 정렬 옵션: 최신순, 이름순, 지역별
 *
 * @dependencies
 * - next/navigation: useSearchParams, useRouter
 * - components/ui/select.tsx: Select 컴포넌트
 * - lucide-react: ArrowUpDown
 */

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type BookmarkSortOption = "latest" | "name" | "region";

interface BookmarkSortProps {
  className?: string;
}

/**
 * 북마크 정렬 컴포넌트
 */
export function BookmarkSort({ className }: BookmarkSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 정렬 옵션 읽기
  const currentSort =
    (searchParams.get("sort") as BookmarkSortOption) || "latest";

  /**
   * 정렬 옵션 변경 핸들러
   */
  const handleSortChange = (value: BookmarkSortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "latest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`/bookmarks?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={className}>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]" aria-label="정렬 옵션 선택">
          <ArrowUpDown className="h-4 w-4 mr-2" aria-hidden="true" />
          <SelectValue placeholder="정렬 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">최신순</SelectItem>
          <SelectItem value="name">이름순</SelectItem>
          <SelectItem value="region">지역별</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

