/**
 * @file app/not-found.tsx
 * @description 전역 404 페이지
 *
 * 주요 기능:
 * 1. 존재하지 않는 페이지에 접근했을 때 표시되는 전역 404 페이지
 * 2. 사용자 친화적인 에러 메시지 및 네비게이션 옵션 제공
 * 3. SEO 최적화 (robots: noindex, nofollow)
 *
 * @dependencies
 * - next/link: Link 컴포넌트
 * - components/ui/button: Button 컴포넌트
 * - @clerk/nextjs: SignedIn 컴포넌트
 * - lucide-react: Home, Search, BarChart3, Bookmark 아이콘
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, BarChart3, Bookmark } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "404 - 페이지를 찾을 수 없습니다 | My Trip",
  description: "요청하신 페이지를 찾을 수 없습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* 404 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <span className="text-5xl font-bold text-destructive">404</span>
          </div>
        </div>

        {/* 메시지 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2" aria-label="홈으로 돌아가기">
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2"
            aria-label="관광지 검색"
          >
            <Link href="/">
              <Search className="h-4 w-4" aria-hidden="true" />
              관광지 검색
            </Link>
          </Button>
        </div>

        {/* 추가 링크 */}
        <div className="flex flex-wrap justify-center gap-4 text-sm pt-2">
          <Link
            href="/stats"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            aria-label="통계 페이지로 이동"
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            통계 보기
          </Link>
          <SignedIn>
            <Link
              href="/bookmarks"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              aria-label="북마크 페이지로 이동"
            >
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              북마크
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

