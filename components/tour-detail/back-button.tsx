"use client";

/**
 * @file components/tour-detail/back-button.tsx
 * @description 뒤로가기 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 이전 페이지로 이동
 * 2. 홈으로 이동 (히스토리가 없을 경우)
 *
 * @dependencies
 * - next/navigation: useRouter
 * - components/ui/button.tsx: Button 컴포넌트
 * - lucide-react: ArrowLeft 아이콘
 */

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 뒤로가기 버튼 컴포넌트
 */
export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // 이전 페이지가 있으면 뒤로 가고, 없으면 홈으로 이동
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="gap-2"
      aria-label="이전 페이지로 이동"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">이전</span>
    </Button>
  );
}

