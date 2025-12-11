/**
 * @file app/places/[contentId]/not-found.tsx
 * @description 상세페이지 404 에러 페이지
 *
 * 존재하지 않는 contentId로 접근했을 때 표시되는 페이지
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">관광지를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground max-w-md">
            요청하신 관광지 정보가 존재하지 않거나 유효하지 않은 ID입니다.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

