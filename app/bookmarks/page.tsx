/**
 * @file app/bookmarks/page.tsx
 * @description 북마크 목록 페이지
 *
 * 주요 기능:
 * 1. 인증된 사용자의 북마크한 관광지 목록 표시
 * 2. 북마크 관리 기능 (정렬, 삭제)
 * 3. 로그인하지 않은 경우 로그인 유도
 *
 * @dependencies
 * - @clerk/nextjs/server: auth
 * - @clerk/nextjs: SignedIn, SignedOut, SignInButton
 * - actions/bookmarks: getBookmarkedTours
 * - components/bookmarks/bookmark-list: BookmarkList
 */

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Suspense } from "react";
import { getBookmarkedTours } from "@/actions/bookmarks";
import { BookmarkList, BookmarkListSkeleton } from "@/components/bookmarks/bookmark-list";
import { BookmarkSort } from "@/components/bookmarks/bookmark-sort";
import { Button } from "@/components/ui/button";
import { Bookmark, LogIn } from "lucide-react";

/**
 * 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "북마크 | My Trip",
  description: "저장한 관광지 목록을 확인하고 관리하세요.",
  openGraph: {
    title: "북마크 | My Trip",
    description: "저장한 관광지 목록을 확인하고 관리하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "My Trip",
  },
  twitter: {
    card: "summary",
    title: "북마크 | My Trip",
    description: "저장한 관광지 목록을 확인하고 관리하세요.",
  },
};

/**
 * 북마크 목록 데이터를 가져오는 Server Component
 */
async function BookmarkListData() {
  const { tours, bookmarkDates } = await getBookmarkedTours();

  return <BookmarkList tours={tours} bookmarkDates={bookmarkDates} />;
}


/**
 * 로그인 유도 UI
 */
function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-primary/10 p-6">
          <Bookmark className="h-12 w-12 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">로그인이 필요합니다</h2>
          <p className="text-muted-foreground max-w-md">
            북마크 기능을 사용하려면 로그인이 필요합니다.
            <br />
            로그인 후 관광지를 북마크하고 여기서 확인할 수 있습니다.
          </p>
        </div>
      </div>
      <SignInButton mode="modal">
        <Button size="lg" className="gap-2">
          <LogIn className="h-5 w-5" aria-hidden="true" />
          로그인하기
        </Button>
      </SignInButton>
    </div>
  );
}

/**
 * 북마크 목록 페이지
 */
export default async function BookmarksPage() {
  const authInstance = await auth();
  const isAuthenticated = !!authInstance.userId;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* 헤더 영역 */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">북마크</h1>
        <p className="text-muted-foreground">
          저장한 관광지 목록을 확인하고 관리하세요.
        </p>
      </div>

      {/* 인증 상태에 따른 콘텐츠 표시 */}
      <SignedIn>
        {/* 정렬 옵션 (Sticky) */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6 -mx-4 px-4 py-4">
          <div className="container mx-auto flex justify-end">
            <BookmarkSort />
          </div>
        </div>

        {/* 북마크 목록 */}
        <Suspense fallback={<BookmarkListSkeleton />}>
          <BookmarkListData />
        </Suspense>
      </SignedIn>

      <SignedOut>
        <SignInPrompt />
      </SignedOut>
    </div>
  );
}

