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
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 필터 영역 로딩 Skeleton UI
 */
function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 flex-wrap">
        {/* 지역 필터 Skeleton */}
        <div className="flex-1 min-w-[150px] sm:min-w-[180px]">
          <Skeleton className="h-3 w-12 mb-1.5" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* 관광 타입 필터 Skeleton */}
        <div className="flex-1 min-w-full sm:min-w-[200px]">
          <Skeleton className="h-3 w-16 mb-1.5" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-16" />
            ))}
          </div>
        </div>
        {/* 정렬 필터 Skeleton */}
        <div className="flex-1 min-w-[150px] sm:min-w-[180px]">
          <Skeleton className="h-3 w-12 mb-1.5" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * 지역 목록 데이터를 가져오는 Server Component
 */
async function AreaCodesData() {
  try {
    const areaCodes = await getAreaCode({ numOfRows: 100 });
    return <TourFilters areaCodes={areaCodes} />;
  } catch (error) {
    // 지역 목록 로드 실패 시 에러 로깅
    console.error("지역 코드 로드 실패:", error);
    // 빈 배열로 처리 (필터는 작동하지만 지역 목록이 비어있음)
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

    // 페이지 번호 파싱
    const pageNo = params.page ? parseInt(String(params.page), 10) : 1;
    const validPageNo = pageNo > 0 ? pageNo : 1;

    // API 호출 (검색 또는 목록 조회)
    let allTours: TourItem[] = [];
    let totalCount = 0;

    if (keyword && keyword.length > 0) {
      // 검색 모드: searchKeyword API 호출
      if (contentTypeIds.length === 0) {
        // 타입 필터가 없으면 검색만
        const result = await searchKeyword({
          keyword,
          areaCode,
          numOfRows: 12,
          pageNo: validPageNo,
        });
        allTours = result.items;
        totalCount = result.totalCount;
      } else if (contentTypeIds.length === 1) {
        // 단일 타입 필터 + 검색
        const result = await searchKeyword({
          keyword,
          areaCode,
          contentTypeId: contentTypeIds[0],
          numOfRows: 12,
          pageNo: validPageNo,
        });
        allTours = result.items;
        totalCount = result.totalCount;
      } else {
        // 다중 타입 필터 + 검색: 각 타입별로 병렬 API 호출
        const apiCalls = contentTypeIds.map((contentTypeId) =>
          searchKeyword({
            keyword,
            areaCode,
            contentTypeId,
            numOfRows: 12,
            pageNo: 1, // 다중 타입일 때는 각 타입별로 첫 페이지만
          })
        );

        const results = await Promise.all(apiCalls);
        
        // 결과 합치기 (중복 제거: contentid 기준)
        const tourMap = new Map<string, TourItem>();
        for (const result of results) {
          for (const tour of result.items) {
            if (!tourMap.has(tour.contentid)) {
              tourMap.set(tour.contentid, tour);
            }
          }
          // totalCount는 첫 번째 결과의 것을 사용 (정확하지 않지만 근사치)
          if (totalCount === 0) {
            totalCount = result.totalCount;
          }
        }
        allTours = Array.from(tourMap.values());
      }
    } else {
      // 목록 모드: getAreaBasedList API 호출 (기존 로직)
      if (contentTypeIds.length === 0) {
        // 타입 필터가 없으면 전체 조회
        // areaCode도 없으면 기본값으로 서울(1) + 관광지 타입(12) 조회
        const defaultAreaCode = areaCode || "1"; // 기본값: 서울
        const defaultContentTypeId = areaCode ? undefined : "12"; // 지역 필터가 없으면 관광지 타입 기본값
        
        const result = await getAreaBasedList({
          areaCode: defaultAreaCode,
          contentTypeId: defaultContentTypeId,
          numOfRows: 12,
          pageNo: validPageNo,
        });
        allTours = result.items;
        totalCount = result.totalCount;
        
        // 개발 환경에서 API 응답 로깅
        if (process.env.NODE_ENV === "development") {
          console.log("관광지 목록 조회 결과:", {
            areaCode: defaultAreaCode,
            contentTypeId: defaultContentTypeId || "없음",
            itemsCount: result.items.length,
            totalCount: result.totalCount,
            isDefault: !areaCode && !defaultContentTypeId,
          });
        }
      } else if (contentTypeIds.length === 1) {
        // 단일 타입 선택
        const result = await getAreaBasedList({
          areaCode,
          contentTypeId: contentTypeIds[0],
          numOfRows: 12,
          pageNo: validPageNo,
        });
        allTours = result.items;
        totalCount = result.totalCount;
      } else {
        // 다중 타입 선택: 각 타입별로 병렬 API 호출
        const apiCalls = contentTypeIds.map((contentTypeId) =>
          getAreaBasedList({
            areaCode,
            contentTypeId,
            numOfRows: 12, // 각 타입별로 12개씩 가져오기
            pageNo: 1, // 다중 타입일 때는 각 타입별로 첫 페이지만
          })
        );

        const results = await Promise.all(apiCalls);
        
        // 결과 합치기 (중복 제거: contentid 기준)
        const tourMap = new Map<string, TourItem>();
        for (const result of results) {
          for (const tour of result.items) {
            if (!tourMap.has(tour.contentid)) {
              tourMap.set(tour.contentid, tour);
            }
          }
          // totalCount는 첫 번째 결과의 것을 사용 (정확하지 않지만 근사치)
          if (totalCount === 0) {
            totalCount = result.totalCount;
          }
        }
        allTours = Array.from(tourMap.values());
      }
    }

    // 정렬 처리 (클라이언트 사이드)
    // 다중 타입 필터가 아닌 경우에만 정렬 (다중 타입은 이미 정렬된 상태로 합쳐짐)
    let sortedTours = [...allTours];
    if (contentTypeIds.length <= 1) {
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
    }

    // API에서 이미 페이지당 12개로 제한되어 반환됨
    return (
      <ListMapView
        tours={sortedTours}
        totalCount={totalCount}
        currentPage={validPageNo}
        sort={sort}
        searchKeyword={keyword}
      />
    );
  } catch (error) {
    // 에러 로깅 (서버 사이드)
    console.error("관광지 목록 로드 실패:", error);
    
    // 에러 메시지 생성
    let errorMessage: Error;
    if (error instanceof Error) {
      // API 키 관련 에러인지 확인
      if (error.message.includes("API 키") || error.message.includes("CONFIG_ERROR")) {
        errorMessage = new Error(
          "API 키가 설정되지 않았습니다. NEXT_PUBLIC_TOUR_API_KEY 환경변수를 확인해주세요."
        );
      } else if (error.message.includes("인증키 오류") || error.message.includes("0002")) {
        errorMessage = new Error(
          "API 인증키 오류입니다. 발급받은 API 키가 올바른지 확인해주세요."
        );
      } else {
        errorMessage = error;
      }
    } else {
      errorMessage = new Error("알 수 없는 오류가 발생했습니다.");
    }
    
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
          <Suspense fallback={<FiltersSkeleton />}>
            <AreaCodesData />
          </Suspense>
        </div>
      </section>

      {/* List/Map 영역 */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <Suspense fallback={<ListMapView loading={true} tours={[]} />}>
          <TourListData searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
