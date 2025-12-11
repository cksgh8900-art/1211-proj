"use client";

import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: "api" | "network" | "general";
  onRetry?: () => void;
  className?: string;
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
}: ErrorMessageProps) {
  const config = errorConfig[type];
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
      {onRetry && (
        <Button
          onClick={onRetry}
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

