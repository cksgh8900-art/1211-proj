"use client";

import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: "api" | "network" | "general";
  onRetry?: () => void;
  className?: string;
  autoDetectOffline?: boolean; // 오프라인 자동 감지 여부
  defaultRetry?: boolean; // 기본 재시도 버튼 표시 여부 (onRetry가 없을 때)
}

const errorConfig = {
  api: {
    defaultTitle: "데이터를 불러올 수 없습니다",
    defaultMessage: "데이터를 불러오는 중 오류가 발생했습니다.",
    icon: AlertCircle,
  },
  network: {
    defaultTitle: "인터넷 연결 확인",
    defaultMessage: "인터넷 연결을 확인해주세요.",
    icon: WifiOff,
  },
  general: {
    defaultTitle: "오류가 발생했습니다",
    defaultMessage: "알 수 없는 오류가 발생했습니다.",
    icon: AlertCircle,
  },
};

export function ErrorMessage({
  title,
  message,
  type = "general",
  onRetry,
  className,
  autoDetectOffline = false,
  defaultRetry = false,
}: ErrorMessageProps) {
  const [isOffline, setIsOffline] = useState(false);

  /**
   * 기본 재시도 핸들러 (페이지 새로고침)
   */
  const handleDefaultRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // 재시도 함수 결정: onRetry가 있으면 사용, 없으면 defaultRetry가 true일 때 기본 재시도 사용
  const retryHandler = onRetry || (defaultRetry ? handleDefaultRetry : undefined);
  const showRetryButton = !!retryHandler;

  // 오프라인 감지 (autoDetectOffline이 true일 때만)
  useEffect(() => {
    if (!autoDetectOffline) return;

    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    // 초기 상태 확인
    updateOnlineStatus();

    // 이벤트 리스너 등록
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [autoDetectOffline]);

  // 오프라인 감지 시 타입을 network로 변경
  const actualType = autoDetectOffline && isOffline ? "network" : type;
  const config = errorConfig[actualType];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 rounded-lg border border-destructive/50 bg-destructive/10",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Icon
          className="w-8 h-8 text-destructive"
          aria-hidden="true"
        />
        <h3 className="text-lg font-semibold text-foreground">
          {displayTitle}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {displayMessage}
        </p>
      </div>
      {showRetryButton && (
        <Button
          onClick={retryHandler}
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="재시도"
        >
          <RefreshCw className="w-4 h-4" />
          다시 시도
        </Button>
      )}
    </div>
  );
}

