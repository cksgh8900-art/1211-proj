"use client";

/**
 * @file app/error.tsx
 * @description 라우트 세그먼트 에러 처리 컴포넌트
 *
 * 주요 기능:
 * 1. Next.js 15 App Router의 Error Boundary 패턴 구현
 * 2. 라우트 세그먼트에서 발생한 에러를 사용자 친화적으로 처리
 * 3. 에러 타입별 분기 처리 (API 에러, 네트워크 에러, 일반 에러)
 * 4. 재시도 및 홈으로 돌아가기 기능 제공
 *
 * @dependencies
 * - next/link: Link 컴포넌트
 * - components/ui/button: Button 컴포넌트
 * - lucide-react: AlertCircle, RefreshCw, Home 아이콘
 */

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logRouteError } from "@/lib/utils/error-logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅
    logRouteError(error, error.digest);
  }, [error]);

  // 에러 타입 확인
  const isApiError = error.name === "TourApiError";
  const isNetworkError =
    error.message.includes("network") ||
    error.message.includes("fetch") ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("NetworkError");

  // 에러 메시지 결정
  const getErrorMessage = () => {
    if (isApiError) {
      return "데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    if (isNetworkError) {
      return "인터넷 연결을 확인하고 다시 시도해주세요.";
    }
    return "예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.";
  };

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center p-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full space-y-6 text-center">
        {/* 에러 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle
              className="h-12 w-12 text-destructive"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">오류가 발생했습니다</h1>
          <p className="text-muted-foreground">{getErrorMessage()}</p>
        </div>

        {/* 개발 환경에서만 에러 상세 정보 표시 */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left border rounded-lg p-4 bg-muted/50">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              에러 상세 정보 (개발 환경)
            </summary>
            <div className="mt-3 space-y-2">
              <div>
                <span className="text-xs font-semibold text-muted-foreground">
                  에러 이름:
                </span>
                <p className="text-xs font-mono text-foreground mt-1">
                  {error.name}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground">
                  에러 메시지:
                </span>
                <p className="text-xs font-mono text-foreground mt-1 break-words">
                  {error.message}
                </p>
              </div>
              {error.digest && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Error Digest:
                  </span>
                  <p className="text-xs font-mono text-foreground mt-1">
                    {error.digest}
                  </p>
                </div>
              )}
              {error.stack && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    스택 트레이스:
                  </span>
                  <pre className="mt-2 text-xs overflow-auto bg-background p-3 rounded border max-h-48 font-mono">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={reset}
            variant="default"
            size="lg"
            className="gap-2"
            aria-label="에러 재시도"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            다시 시도
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2"
            aria-label="홈으로 돌아가기"
          >
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

