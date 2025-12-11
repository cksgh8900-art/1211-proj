"use client";

/**
 * @file components/tour-detail/copy-address-button.tsx
 * @description 주소 복사 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 주소를 클립보드에 복사
 * 2. 복사 완료 토스트 메시지 표시
 *
 * @dependencies
 * - lib/utils/toast.ts: showToast
 * - components/ui/button.tsx: Button
 * - lucide-react: Copy
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/utils/toast";

interface CopyAddressButtonProps {
  address: string;
  className?: string;
}

/**
 * 주소 복사 버튼 컴포넌트
 */
export function CopyAddressButton({
  address,
  className,
}: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // 클립보드 API 사용 (HTTPS 환경 또는 localhost에서만 동작)
      await navigator.clipboard.writeText(address);
      setCopied(true);
      showToast.success("주소가 복사되었습니다.");

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // 클립보드 API가 지원되지 않거나 실패한 경우
      console.error("주소 복사 실패:", error);
      showToast.error("주소 복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
      aria-label="주소 복사"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          <span className="ml-1">복사됨</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden="true" />
          <span className="ml-1">복사</span>
        </>
      )}
    </Button>
  );
}

