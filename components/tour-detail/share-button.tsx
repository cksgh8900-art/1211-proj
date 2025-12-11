"use client";

/**
 * @file components/tour-detail/share-button.tsx
 * @description URL 공유 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 현재 페이지 URL을 클립보드에 복사
 * 2. 복사 완료 토스트 메시지 표시
 * 3. 공유 아이콘 버튼
 *
 * @dependencies
 * - lib/utils/toast.ts: showToast
 * - components/ui/button.tsx: Button
 * - lucide-react: Share2, Check
 */

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/utils/toast";

interface ShareButtonProps {
  contentId: string;
  title?: string; // 선택 사항, 토스트 메시지에 사용 가능
  className?: string;
}

/**
 * URL 공유 버튼 컴포넌트
 */
export function ShareButton({
  contentId,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      // 현재 페이지 URL 생성
      const url = `${window.location.origin}/places/${contentId}`;

      // 클립보드 API 사용 (HTTPS 환경 또는 localhost에서만 동작)
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast.success("링크가 복사되었습니다.");

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // 클립보드 API가 지원되지 않거나 실패한 경우
      console.error("링크 복사 실패:", error);
      showToast.error("링크 복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={className}
      aria-label={copied ? "링크가 복사되었습니다" : "링크 복사"}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          <span className="ml-1 hidden sm:inline">복사됨</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span className="ml-1 hidden sm:inline">공유</span>
        </>
      )}
    </Button>
  );
}

