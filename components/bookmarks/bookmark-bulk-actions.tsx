"use client";

/**
 * @file components/bookmarks/bookmark-bulk-actions.tsx
 * @description 북마크 일괄 삭제 컴포넌트
 *
 * 주요 기능:
 * 1. 체크박스로 여러 북마크 선택
 * 2. 전체 선택/해제
 * 3. 선택된 항목 일괄 삭제
 * 4. 확인 다이얼로그
 *
 * @dependencies
 * - actions/bookmarks: removeBookmark
 * - components/ui/button: Button
 * - components/ui/checkbox: Checkbox
 * - components/ui/dialog: Dialog
 * - lib/utils/toast: showToast
 * - lucide-react: Trash2, CheckSquare, Square
 */

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { removeBookmark } from "@/actions/bookmarks";
import { showToast } from "@/lib/utils/toast";
import { cn } from "@/lib/utils";

interface BookmarkBulkActionsProps {
  tours: Array<{ contentid: string; title: string }>;
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onToggleSelect: (contentId: string) => void;
  className?: string;
}

/**
 * 북마크 일괄 삭제 컴포넌트
 */
export function BookmarkBulkActions({
  tours,
  selectedIds,
  onSelectAll,
  onToggleSelect,
  className,
}: BookmarkBulkActionsProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 전체 선택 여부
  const isAllSelected = useMemo(() => {
    return tours.length > 0 && selectedIds.size === tours.length;
  }, [tours.length, selectedIds.size]);

  /**
   * 일괄 삭제 핸들러
   */
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    try {
      const deletePromises = Array.from(selectedIds).map((contentId) =>
        removeBookmark(contentId)
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      if (failCount === 0) {
        showToast.success(`${successCount}개의 북마크가 제거되었습니다.`);
      } else {
        showToast.warning(
          `${successCount}개는 제거되었지만, ${failCount}개는 실패했습니다.`
        );
      }

      setIsDialogOpen(false);
      // 선택 해제는 부모 컴포넌트에서 처리
      // 페이지 새로고침하여 목록 업데이트
      router.refresh();
    } catch (error) {
      console.error("일괄 삭제 실패:", error);
      showToast.error("북마크 제거 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 선택된 항목이 없으면 컴포넌트 숨김
  if (tours.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* 전체 선택 체크박스 */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          aria-label="전체 선택"
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium cursor-pointer select-none"
          onClick={handleSelectAll}
        >
          전체 선택
        </label>
      </div>

      {/* 선택된 항목 개수 및 삭제 버튼 */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedIds.size}개 선택됨
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2"
            aria-label="선택된 항목 삭제"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            선택 항목 삭제
          </Button>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>북마크 일괄 제거</DialogTitle>
            <DialogDescription>
              선택한 {selectedIds.size}개의 북마크를 제거하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "제거 중..." : "제거"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * 북마크 항목에 체크박스를 추가하는 래퍼 컴포넌트
 */
interface BookmarkItemCheckboxProps {
  contentId: string;
  isSelected: boolean;
  onToggle: (contentId: string) => void;
  className?: string;
}

export function BookmarkItemCheckbox({
  contentId,
  isSelected,
  onToggle,
  className,
}: BookmarkItemCheckboxProps) {
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={() => onToggle(contentId)}
      className={className}
      aria-label={`${contentId} 선택`}
    />
  );
}

