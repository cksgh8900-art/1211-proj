/**
 * @file app/page.tsx
 * @description My Trip 홈페이지 - 관광지 목록 및 지도 표시
 *
 * 주요 기능:
 * 1. 관광지 목록 표시
 * 2. 필터 및 정렬 기능
 * 3. 네이버 지도 연동
 * 4. 검색 기능
 *
 * 레이아웃 구조:
 * - Hero Section (데스크톱만, 선택 사항)
 * - Filters & Controls (Sticky)
 * - List/Map 영역 (데스크톱: 2컬럼, 모바일: 탭)
 *
 * @dependencies
 * - components/tour-list.tsx (Phase 2.2)
 * - components/tour-filters.tsx (Phase 2.3)
 * - components/tour-search.tsx (Phase 2.4)
 * - components/naver-map.tsx (Phase 2.5)
 * - lib/api/tour-api.ts: getAreaBasedList, getAreaCode
 */

import { Suspense } from "react";
import { getAreaBasedList, getAreaCode, searchKeyword } from "@/lib/api/tour-api";
import type { TourItem } from "@/lib/types/tour";
import { TourFilters } from "@/components/tour-filters";
import { ListMapView } from "@/components/list-map-view";

/**
 * 지역 목록 데이터를 가져오는 Server Component
 */
async function AreaCodesData() {
  try {
    const areaCodes = await getAreaCode({ numOfRows: 100 });
    return <TourFilters areaCodes={areaCodes} />;
  } catch {
    // 지역 목록 로드 실패 시 빈 배열로 처리
    return <TourFilters areaCodes={[]} />;
  }
}

/**
 * 관광지 목록 데이터를 가져오는 Server Component
 */
async function TourListData({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const params = await searchParams;

    // 검색 키워드 파싱
    const keyword = params.keyword ? String(params.keyword).trim() : undefined;

    // 필터 값 파싱
    const areaCode = params.area ? String(params.area) : undefined;
    const typeParams = params.type;
    const contentTypeIds = Array.isArray(typeParams)
      ? typeParams.filter((t): t is string => typeof t === "string" && t.length > 0)
      : typeParams
      ? [String(typeParams)]
      : [];
    const sort: "latest" | "name" =
      params.sort === "name" ? "name" : "latest";

    // API 호출 (검색 또는 목록 조회)
    let allTours: TourItem[] = [];

    if (keyword && keyword.length > 0) {
      // 검색 모드: searchKeyword API 호출
      if (contentTypeIds.length === 0) {
        // 타입 필터가 없으면 검색만
        allTours = await searchKeyword({
          keyword,
          areaCode,
          numOfRows: 12,
          pageNo: 1,
        });
      } else if (contentTypeIds.length === 1) {
        // 단일 타입 필터 + 검색
        allTours = await searchKeyword({
          keyword,
          areaCode,
          contentTypeId: contentTypeIds[0],
          numOfRows: 12,
          pageNo: 1,
        });
      } else {
        // 다중 타입 필터 + 검색: 각 타입별로 병렬 API 호출
        const apiCalls = contentTypeIds.map((contentTypeId) =>
          searchKeyword({
            keyword,
            areaCode,
            contentTypeId,
            numOfRows: 12,
            pageNo: 1,
          })
        );

        const results = await Promise.all(apiCalls);
        
        // 결과 합치기 (중복 제거: contentid 기준)
        const tourMap = new Map<string, TourItem>();
        for (const tours of results) {
          for (const tour of tours) {
            if (!tourMap.has(tour.contentid)) {
              tourMap.set(tour.contentid, tour);
            }
          }
        }
        allTours = Array.from(tourMap.values());
      }
    } else {
      // 목록 모드: getAreaBasedList API 호출 (기존 로직)
      if (contentTypeIds.length === 0) {
        // 타입 필터가 없으면 전체 조회
        allTours = await getAreaBasedList({
          areaCode,
          numOfRows: 12,
          pageNo: 1,
        });
      } else if (contentTypeIds.length === 1) {
        // 단일 타입 선택
        allTours = await getAreaBasedList({
          areaCode,
          contentTypeId: contentTypeIds[0],
          numOfRows: 12,
          pageNo: 1,
        });
      } else {
        // 다중 타입 선택: 각 타입별로 병렬 API 호출
        const apiCalls = contentTypeIds.map((contentTypeId) =>
          getAreaBasedList({
            areaCode,
            contentTypeId,
            numOfRows: 12, // 각 타입별로 12개씩 가져오기
            pageNo: 1,
          })
        );

        const results = await Promise.all(apiCalls);
        
        // 결과 합치기 (중복 제거: contentid 기준)
        const tourMap = new Map<string, TourItem>();
        for (const tours of results) {
          for (const tour of tours) {
            if (!tourMap.has(tour.contentid)) {
              tourMap.set(tour.contentid, tour);
            }
          }
        }
        allTours = Array.from(tourMap.values());
      }
    }

    // 정렬 처리 (클라이언트 사이드)
    const sortedTours = [...allTours];
    if (sort === "name") {
      sortedTours.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    } else {
      // 최신순 (modifiedtime 내림차순)
      sortedTours.sort(
        (a, b) =>
          new Date(b.modifiedtime).getTime() -
          new Date(a.modifiedtime).getTime()
      );
    }

    // 결과 개수 제한 (12개)
    const limitedTours = sortedTours.slice(0, 12);

    return (
      <ListMapView
        tours={limitedTours}
        sort={sort}
        searchKeyword={keyword}
      />
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error : new Error("알 수 없는 오류");
    return <ListMapView tours={[]} error={errorMessage} />;
  }
}

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  return (
    <main className="flex-1">
      {/* Hero Section (선택 사항, 데스크톱만) */}
      <section className="hidden lg:block py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            한국의 아름다운 관광지를 탐험하세요
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            전국 관광지 정보를 한눈에 보고 지도에서 확인하세요
          </p>
          {/* Phase 2.4에서 검색창 컴포넌트 추가 예정 */}
        </div>
      </section>

      {/* Filters & Controls (Sticky) */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Suspense fallback={<div className="h-20" />}>
            <AreaCodesData />
          </Suspense>
        </div>
      </section>

      {/* List/Map 영역 */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Suspense fallback={<ListMapView loading={true} tours={[]} />}>
            <TourListData searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
