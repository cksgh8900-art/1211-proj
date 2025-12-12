/**
 * @file 통계 데이터 수집 API
 * @description 통계 대시보드에 필요한 지역별/타입별 관광지 통계 데이터를 수집하는 함수들
 * 
 * PRD.md 2.6 통계 대시보드 기반으로 작성
 * 
 * 주요 기능:
 * 1. 지역별 관광지 개수 집계 (getRegionStats)
 * 2. 타입별 관광지 개수 집계 (getTypeStats)
 * 3. 통계 요약 정보 생성 (getStatsSummary)
 * 
 * 성능 최적화:
 * - Promise.all을 사용한 병렬 API 호출
 * - 각 호출은 numOfRows: 1로 설정하여 응답 크기 최소화
 * 
 * 데이터 캐싱:
 * - 이 함수들은 Server Component에서 호출됩니다
 * - Next.js의 데이터 캐싱을 활용하려면 페이지 레벨에서 unstable_cache를 사용하거나
 *   fetch의 next.revalidate 옵션을 설정하세요 (revalidate: 3600 권장)
 * - 통계 데이터는 변동이 적으므로 1시간 캐싱이 적절합니다
 * 
 * 에러 처리:
 * - 개별 API 호출 실패 시 해당 항목은 제외하고 계속 진행
 * - 부분 데이터 반환 허용
 */

import { getAreaBasedList } from "@/lib/api/tour-api";
import type { RegionStats, TypeStats, StatsSummary } from "@/lib/types/stats";
import { AREA_CODE_NAME, CONTENT_TYPE_NAME } from "@/lib/types/stats";
import type { ContentTypeId } from "@/lib/types/tour";

/**
 * 지역별 관광지 통계 수집
 * 
 * 각 시/도별 관광지 개수를 집계합니다.
 * AREA_CODE_NAME에 정의된 모든 지역 코드에 대해 병렬로 API를 호출합니다.
 * 
 * @returns 지역별 관광지 통계 배열
 * 
 * @example
 * ```typescript
 * const stats = await getRegionStats();
 * // [{ areaCode: "1", areaName: "서울", count: 1234 }, ...]
 * ```
 */
export async function getRegionStats(): Promise<RegionStats[]> {
  const areaCodes = Object.keys(AREA_CODE_NAME);

  // 개발 환경에서 시작 시간 측정
  const startTime = process.env.NODE_ENV === "development" ? Date.now() : undefined;

  const results = await Promise.all(
    areaCodes.map(async (areaCode) => {
      try {
        const result = await getAreaBasedList({
          areaCode,
          numOfRows: 1, // totalCount만 필요하므로 최소값 설정
          pageNo: 1,
        });

        return {
          areaCode,
          areaName: AREA_CODE_NAME[areaCode],
          count: result.totalCount,
        } as RegionStats;
      } catch (error) {
        // 개별 지역 조회 실패 시 로그 기록하고 null 반환
        if (process.env.NODE_ENV === "development") {
          console.error(
            `[getRegionStats] 지역 통계 조회 실패 (${areaCode}, ${AREA_CODE_NAME[areaCode]}):`,
            error instanceof Error ? error.message : error
          );
        }
        return null;
      }
    })
  );

  // null 값 제거 및 타입 안전성 보장
  const validResults = results.filter(
    (r): r is RegionStats => r !== null
  );

  // 개발 환경에서 성능 로깅
  if (startTime && process.env.NODE_ENV === "development") {
    const duration = Date.now() - startTime;
    console.log(
      `[getRegionStats] 완료: ${validResults.length}/${areaCodes.length} 지역, 소요 시간: ${duration}ms`
    );
  }

  return validResults;
}

/**
 * 타입별 관광지 통계 수집
 * 
 * 각 관광 타입별 관광지 개수를 집계합니다.
 * CONTENT_TYPE_NAME에 정의된 모든 타입에 대해 병렬로 API를 호출합니다.
 * 
 * @returns 타입별 관광지 통계 배열 (percentage 포함)
 * 
 * @example
 * ```typescript
 * const stats = await getTypeStats();
 * // [{ contentTypeId: "12", typeName: "관광지", count: 5678, percentage: 45.2 }, ...]
 * ```
 */
export async function getTypeStats(): Promise<TypeStats[]> {
  const contentTypeIds = Object.keys(CONTENT_TYPE_NAME);

  // 개발 환경에서 시작 시간 측정
  const startTime = process.env.NODE_ENV === "development" ? Date.now() : undefined;

  const results = await Promise.all(
    contentTypeIds.map(async (contentTypeId) => {
      try {
        const result = await getAreaBasedList({
          contentTypeId: contentTypeId as ContentTypeId,
          numOfRows: 1, // totalCount만 필요하므로 최소값 설정
          pageNo: 1,
        });

        return {
          contentTypeId: contentTypeId as ContentTypeId,
          typeName: CONTENT_TYPE_NAME[contentTypeId],
          count: result.totalCount,
        } as TypeStats;
      } catch (error) {
        // 개별 타입 조회 실패 시 로그 기록하고 null 반환
        if (process.env.NODE_ENV === "development") {
          console.error(
            `[getTypeStats] 타입 통계 조회 실패 (${contentTypeId}, ${CONTENT_TYPE_NAME[contentTypeId]}):`,
            error instanceof Error ? error.message : error
          );
        }
        return null;
      }
    })
  );

  // null 값 제거 및 타입 안전성 보장
  const validResults = results.filter((r): r is TypeStats => r !== null);

  // 전체 개수 계산
  const totalCount = validResults.reduce((sum, r) => sum + r.count, 0);

  // 백분율 계산
  const resultsWithPercentage = validResults.map((r) => ({
    ...r,
    percentage: totalCount > 0 ? (r.count / totalCount) * 100 : 0,
  }));

  // 개발 환경에서 성능 로깅
  if (startTime && process.env.NODE_ENV === "development") {
    const duration = Date.now() - startTime;
    console.log(
      `[getTypeStats] 완료: ${validResults.length}/${contentTypeIds.length} 타입, 전체 개수: ${totalCount}, 소요 시간: ${duration}ms`
    );
  }

  return resultsWithPercentage;
}

/**
 * 통계 요약 정보 생성
 * 
 * 전체 통계 요약 정보를 생성합니다.
 * - 전체 관광지 수
 * - Top 3 지역 (관광지 개수 기준)
 * - Top 3 타입 (관광지 개수 기준)
 * - 마지막 업데이트 시간
 * 
 * getRegionStats()와 getTypeStats()를 병렬로 호출하여 성능을 최적화합니다.
 * 
 * @returns 통계 요약 정보
 * 
 * @example
 * ```typescript
 * const summary = await getStatsSummary();
 * // {
 * //   totalCount: 50000,
 * //   topRegions: [{ areaCode: "1", areaName: "서울", count: 5000 }, ...],
 * //   topTypes: [{ contentTypeId: "12", typeName: "관광지", count: 10000, percentage: 20 }, ...],
 * //   lastUpdated: new Date()
 * // }
 * ```
 */
export async function getStatsSummary(): Promise<StatsSummary> {
  // 개발 환경에서 시작 시간 측정
  const startTime = process.env.NODE_ENV === "development" ? Date.now() : undefined;

  try {
    // 병렬로 지역별 통계와 타입별 통계 수집
    const [regionStats, typeStats] = await Promise.all([
      getRegionStats(),
      getTypeStats(),
    ]);

    // 전체 관광지 수 계산 (타입별 개수의 합계)
    const totalCount = typeStats.reduce((sum, stat) => sum + stat.count, 0);

    // Top 3 지역: count 내림차순 정렬 후 상위 3개
    const topRegions = [...regionStats]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Top 3 타입: count 내림차순 정렬 후 상위 3개
    const topTypes = [...typeStats]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const summary: StatsSummary = {
      totalCount,
      topRegions,
      topTypes,
      lastUpdated: new Date(),
    };

    // 개발 환경에서 성능 로깅
    if (startTime && process.env.NODE_ENV === "development") {
      const duration = Date.now() - startTime;
      console.log(
        `[getStatsSummary] 완료: 전체 개수 ${totalCount}, Top 3 지역/타입, 소요 시간: ${duration}ms`
      );
    }

    return summary;
  } catch (error) {
    // 전체 실패 시 에러 throw
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    throw new Error(`통계 요약 정보 수집 실패: ${errorMessage}`);
  }
}

