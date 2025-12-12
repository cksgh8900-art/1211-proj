/**
 * @file app/robots.ts
 * @description Robots.txt 생성
 *
 * 주요 기능:
 * 1. 검색 엔진 크롤링 규칙 설정
 * 2. Sitemap URL 지정
 * 3. API 라우트 및 테스트 페이지 크롤링 차단
 *
 * @dependencies
 * - next: MetadataRoute.Robots 타입
 */

import type { MetadataRoute } from "next";

/**
 * Robots.txt 생성
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mytrip.example.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/*", "/auth-test", "/storage-test"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

