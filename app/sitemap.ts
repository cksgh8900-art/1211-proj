/**
 * @file app/sitemap.ts
 * @description 동적 Sitemap 생성
 *
 * 주요 기능:
 * 1. 정적 페이지 URL 생성 (홈, 통계, 북마크)
 * 2. 동적 페이지 URL 생성 (관광지 상세페이지)
 * 3. 검색 엔진 크롤링 최적화
 *
 * @dependencies
 * - next: MetadataRoute.Sitemap 타입
 * - lib/api/tour-api: getAreaBasedList
 */

import type { MetadataRoute } from "next";
import { getAreaBasedList } from "@/lib/api/tour-api";

/**
 * 관광 타입 ID 목록 (PRD.md 4.4 참고)
 */
const CONTENT_TYPE_IDS = ["12", "14", "15", "25", "28", "32", "38", "39"];

/**
 * 주요 지역 코드 목록 (서울, 부산, 제주 등)
 * 전체 지역을 조회하면 API 호출이 너무 많아지므로 주요 지역만 포함
 */
const MAIN_AREA_CODES = ["1", "6", "39"]; // 서울, 부산, 제주

/**
 * 날짜 문자열을 Date 객체로 변환
 * @param dateString - YYYYMMDDHHmmss 형식의 날짜 문자열
 * @returns Date 객체 또는 현재 날짜
 */
function parseModifiedTime(dateString: string): Date {
  try {
    // YYYYMMDDHHmmss 형식 파싱
    if (dateString.length >= 8) {
      const year = parseInt(dateString.substring(0, 4), 10);
      const month = parseInt(dateString.substring(4, 6), 10) - 1; // 0-based
      const day = parseInt(dateString.substring(6, 8), 10);
      return new Date(year, month, day);
    }
  } catch (error) {
    console.error("날짜 파싱 실패:", error);
  }
  return new Date();
}

/**
 * 동적 Sitemap 생성
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mytrip.example.com";

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 동적 페이지 (관광지 상세페이지)
  try {
    const dynamicPages: MetadataRoute.Sitemap = [];
    const tourMap = new Map<string, {
      url: string;
      lastModified: Date;
    }>();

    // 주요 지역과 관광 타입별로 병렬 API 호출
    const apiCalls: Promise<void>[] = [];

    for (const areaCode of MAIN_AREA_CODES) {
      for (const contentTypeId of CONTENT_TYPE_IDS) {
        apiCalls.push(
          getAreaBasedList({
            areaCode,
            contentTypeId,
            numOfRows: 100, // 각 조합당 최대 100개
            pageNo: 1,
          })
            .then((result) => {
              // 중복 제거를 위해 Map 사용 (contentid 기준)
              for (const tour of result.items) {
                if (!tourMap.has(tour.contentid)) {
                  tourMap.set(tour.contentid, {
                    url: `${baseUrl}/places/${tour.contentid}`,
                    lastModified: parseModifiedTime(tour.modifiedtime),
                  });
                }
              }
            })
            .catch((error) => {
              // 개별 API 호출 실패는 무시하고 계속 진행
              if (process.env.NODE_ENV === "development") {
                console.error(
                  `Sitemap 생성 실패 (areaCode: ${areaCode}, contentTypeId: ${contentTypeId}):`,
                  error
                );
              }
            })
        );
      }
    }

    // 모든 API 호출 완료 대기
    await Promise.allSettled(apiCalls);

    // Map을 Sitemap 형식으로 변환
    for (const [, tourData] of tourMap) {
      dynamicPages.push({
        url: tourData.url,
        lastModified: tourData.lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // 개발 환경에서 로깅
    if (process.env.NODE_ENV === "development") {
      console.log(`Sitemap 생성 완료: 정적 ${staticPages.length}개, 동적 ${dynamicPages.length}개`);
    }

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    // API 호출 실패 시 정적 페이지만 반환
    console.error("Sitemap 생성 중 오류 발생:", error);
    return staticPages;
  }
}

