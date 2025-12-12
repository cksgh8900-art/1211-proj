/**
 * @file lib/utils/error-logger.ts
 * @description 에러 로깅 유틸리티 함수
 *
 * 주요 기능:
 * 1. 개발 환경: console.error로 에러 로깅
 * 2. 프로덕션 환경: 외부 로깅 서비스 연동 준비 (선택 사항)
 * 3. 에러 정보 수집 및 구조화
 *
 * @dependencies
 * - 브라우저 환경 (클라이언트 사이드)
 */

interface ErrorInfo {
  message: string;
  stack?: string;
  name: string;
  digest?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * 에러 정보를 수집하여 구조화된 객체로 반환
 */
export function collectErrorInfo(error: Error, digest?: string): ErrorInfo {
  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    digest,
    timestamp: new Date().toISOString(),
  };

  // 브라우저 환경에서만 추가 정보 수집
  if (typeof window !== "undefined") {
    errorInfo.url = window.location.href;
    errorInfo.userAgent = navigator.userAgent;
  }

  return errorInfo;
}

/**
 * 에러를 로깅합니다
 *
 * @param error - 에러 객체
 * @param context - 에러 발생 컨텍스트 (선택 사항)
 * @param digest - Next.js 에러 digest (선택 사항)
 */
export function logError(
  error: Error,
  context?: string,
  digest?: string
): void {
  const errorInfo = collectErrorInfo(error, digest);

  // 개발 환경: 상세한 에러 정보를 콘솔에 출력
  if (process.env.NODE_ENV === "development") {
    console.group(
      `🚨 Error${context ? ` in ${context}` : ""}`
    );
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    if (context) {
      console.error("Context:", context);
    }
    console.groupEnd();
  } else {
    // 프로덕션 환경: 간단한 로깅
    console.error("Error:", error.message);
    
    // TODO: 프로덕션 환경에서 외부 로깅 서비스 연동
    // 예: Sentry, LogRocket, Datadog 등
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error, {
    //     contexts: { custom: { context, ...errorInfo } },
    //   });
    // }
  }
}

/**
 * 글로벌 에러를 로깅합니다
 *
 * @param error - 에러 객체
 * @param digest - Next.js 에러 digest (선택 사항)
 */
export function logGlobalError(error: Error, digest?: string): void {
  logError(error, "Global Error Boundary", digest);
}

/**
 * 라우트 세그먼트 에러를 로깅합니다
 *
 * @param error - 에러 객체
 * @param digest - Next.js 에러 digest (선택 사항)
 */
export function logRouteError(error: Error, digest?: string): void {
  logError(error, "Route Segment Error Boundary", digest);
}

