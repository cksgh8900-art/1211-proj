"use client";

/**
 * @file app/global-error.tsx
 * @description 루트 레이아웃 에러 처리 컴포넌트
 *
 * 주요 기능:
 * 1. Next.js 15 App Router의 Global Error Boundary 패턴 구현
 * 2. 루트 레이아웃에서 발생한 심각한 에러를 처리
 * 3. layout.tsx를 대체하는 최소한의 HTML 구조 제공
 *
 * 주의사항:
 * - 이 컴포넌트는 루트 레이아웃의 에러만 처리합니다
 * - 다른 에러는 app/error.tsx가 처리합니다
 * - <html>, <body> 태그를 포함해야 합니다
 *
 * @dependencies
 * - components/ui/button: Button 컴포넌트
 * - lucide-react: AlertTriangle, RefreshCw 아이콘
 */

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logGlobalError } from "@/lib/utils/error-logger";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 에러 로깅
    logGlobalError(error, error.digest);
  }, [error]);

  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full space-y-6 text-center">
            {/* 에러 아이콘 */}
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertTriangle
                  className="h-16 w-16 text-destructive"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                심각한 오류가 발생했습니다
              </h1>
              <p className="text-muted-foreground">
                애플리케이션에 심각한 문제가 발생했습니다.
                <br />
                페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
              </p>
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
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/";
                  }
                }}
                variant="outline"
                size="lg"
                className="gap-2"
                aria-label="홈으로 돌아가기"
              >
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

