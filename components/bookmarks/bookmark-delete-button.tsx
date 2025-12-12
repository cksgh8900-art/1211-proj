"use client";

/**
 * @file components/bookmarks/bookmark-delete-button.tsx
 * @description 북마크 개별 삭제 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 북마크 삭제 버튼
 * 2. 삭제 확인 다이얼로그
 * 3. 삭제 후 목록 새로고침
 *
 * @dependencies
 * - actions/bookmarks: removeBookmark
 * - components/ui/button: Button
 * - components/ui/dialog: Dialog
 * - lib/utils/toast: showToast
 * - lucide-react: Trash2
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface BookmarkDeleteButtonProps {
  contentId: string;
  tourTitle: string;
  className?: string;
}

/**
 * 북마크 개별 삭제 버튼 컴포넌트
 */
export function BookmarkDeleteButton({
  contentId,
  tourTitle,
  className,
}: BookmarkDeleteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * 삭제 핸들러
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await removeBookmark(contentId);
      if (result.success) {
        showToast.success("북마크에서 제거되었습니다.");
        setIsOpen(false);
        // 페이지 새로고침하여 목록 업데이트
        router.refresh();
      } else {
        showToast.error(result.error || "북마크 제거에 실패했습니다.");
      }
    } catch (error) {
      console.error("북마크 삭제 실패:", error);
      showToast.error("북마크 제거 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={className}
        aria-label={`${tourTitle} 북마크 제거`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>북마크 제거</DialogTitle>
            <DialogDescription>
              "{tourTitle}"을(를) 북마크에서 제거하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "제거 중..." : "제거"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

