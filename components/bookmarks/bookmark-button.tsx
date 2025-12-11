"use client";

/**
 * @file components/bookmarks/bookmark-button.tsx
 * @description 북마크 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 북마크 상태 확인 (Server Action 호출)
 * 2. 북마크 추가/제거 토글
 * 3. 별 아이콘 표시 (채워짐/비어있음)
 * 4. 인증 상태 확인 (Clerk)
 * 5. 로그인하지 않은 경우 로그인 유도
 *
 * @dependencies
 * - @clerk/nextjs: useAuth, SignedIn, SignedOut, SignInButton
 * - actions/bookmarks: getBookmark, addBookmark, removeBookmark
 * - lib/utils/toast: showToast
 * - components/ui/button: Button
 * - lucide-react: Star
 */

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getBookmark,
  addBookmark,
  removeBookmark,
} from "@/actions/bookmarks";
import { showToast } from "@/lib/utils/toast";

interface BookmarkButtonProps {
  contentId: string;
  className?: string;
}

/**
 * 북마크 버튼 컴포넌트
 */
export function BookmarkButton({
  contentId,
  className,
}: BookmarkButtonProps) {
  const { isLoaded, userId } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // 북마크 상태 확인
  useEffect(() => {
    if (!isLoaded || !userId) {
      setIsLoading(false);
      return;
    }

    async function checkBookmark() {
      try {
        const bookmarked = await getBookmark(contentId);
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error("북마크 상태 확인 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkBookmark();
  }, [isLoaded, userId, contentId]);

  // 북마크 토글
  const handleToggle = async () => {
    if (!userId || isToggling) return;

    setIsToggling(true);
    try {
      if (isBookmarked) {
        const result = await removeBookmark(contentId);
        if (result.success) {
          setIsBookmarked(false);
          showToast.success("북마크에서 제거되었습니다.");
        } else {
          showToast.error(result.error || "북마크 제거에 실패했습니다.");
        }
      } else {
        const result = await addBookmark(contentId);
        if (result.success) {
          setIsBookmarked(true);
          showToast.success("북마크에 추가되었습니다.");
        } else {
          showToast.error(result.error || "북마크 추가에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
      showToast.error("북마크 처리 중 오류가 발생했습니다.");
    } finally {
      setIsToggling(false);
    }
  };

  // 로딩 상태
  if (!isLoaded || isLoading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={className}
        aria-label="북마크 로딩 중"
      >
        <Star className="h-4 w-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <>
      <SignedIn>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isToggling}
          className={className}
          aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              isBookmarked
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
            aria-hidden="true"
          />
        </Button>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="ghost"
            size="sm"
            className={className}
            aria-label="로그인하여 북마크 추가"
          >
            <Star
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}

